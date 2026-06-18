import json
import logging
import psutil
import time
import urllib.request
from datetime import datetime

# Setup logging
logging.basicConfig(
    filename='voicecut_metrics.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def get_process_stats(process_name_pattern):
    """Find processes matching the pattern and return total CPU and memory."""
    total_cpu = 0.0
    total_memory_mb = 0.0
    found = False

    for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_info']):
        try:
            cmdline = " ".join(proc.info['cmdline'] or [])
            if process_name_pattern in cmdline:
                found = True
                total_cpu += proc.cpu_percent(interval=0.1)
                total_memory_mb += proc.info['memory_info'].rss / (1024 * 1024)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    return found, total_cpu, total_memory_mb

def monitor_resources(interval_seconds=10):
    print(f"[{datetime.now()}] Starting VoiceCut Local Telemetry Monitor...")
    print("Writing metrics to 'voicecut_metrics.log'")
    
    while True:
        try:
        try:
            # Monitor FastAPI Backend (Process level)
            api_found, api_cpu, api_mem = get_process_stats("uvicorn voicecut.backend.api.main:app")
            
            # Monitor Vite Frontend
            web_found, web_cpu, web_mem = get_process_stats("vite")

            # Try to fetch rich health metrics from the API
            api_metrics_str = ""
            if api_found:
                try:
                    req = urllib.request.Request("http://localhost:8000/health/detailed")
                    with urllib.request.urlopen(req, timeout=2) as response:
                        health_data = json.loads(response.read().decode())
                        
                    status = health_data.get("status", "unknown")
                    db = health_data.get("checks", {}).get("database", {}).get("status", "?")
                    pipe_runs = health_data.get("metrics", {}).get("pipeline", {}).get("active_count", 0)
                    analyses = health_data.get("metrics", {}).get("counters", {}).get("analyses", 0)
                    
                    api_metrics_str = f" | API Health: {status.upper()} (DB:{db}) | Active Pipes: {pipe_runs} | Total Analyses: {analyses}"
                except Exception as e:
                    api_metrics_str = f" | API Health: OFFLINE ({e})"

            log_entry = (
                f"API: [CPU: {api_cpu:.1f}%, Mem: {api_mem:.1f}MB, Running: {api_found}] | "
                f"Web: [CPU: {web_cpu:.1f}%, Mem: {web_mem:.1f}MB, Running: {web_found}]"
                f"{api_metrics_str}"
            )
            
            logging.info(log_entry)
            
            # Optional console output for real-time viewing
            # print(log_entry)
            
            time.sleep(interval_seconds)
            
        except KeyboardInterrupt:
            print("\nShutting down monitor.")
            break
        except Exception as e:
            logging.error(f"Monitor error: {e}")
            time.sleep(interval_seconds)

if __name__ == "__main__":
    monitor_resources()
