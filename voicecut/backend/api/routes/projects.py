"""Projects route — CRUD operations for projects and decisions."""
from __future__ import annotations

import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from voicecut.backend.db.database import delete_project, list_projects, load_project, save_project
from voicecut.shared.models import CutStatus, DecisionUpdate, UserDecision

router = APIRouter()


@router.get("/projects")
async def get_projects():
    """List all projects."""
    return await asyncio.to_thread(list_projects)


@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get full project details."""
    project = await asyncio.to_thread(load_project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.model_dump()


@router.patch("/projects/{project_id}/decisions")
async def update_decisions(project_id: str, decisions: list[DecisionUpdate]):
    """
    Batch update user decisions for candidate cuts.

    Body: [{ "cut_id": str, "action": "cut" | "kept" | "pending" | "ignored" }]
    """
    project = await asyncio.to_thread(load_project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Build O(n) lookup map from incoming decisions
    decision_map = {d.cut_id: d.action for d in decisions}

    # Update candidate cuts in-place
    for cut in project.candidate_cuts:
        if cut.id in decision_map:
            cut.status = decision_map[cut.id]

    # O(n) merge: build dict from existing decisions, overlay new ones
    merged: dict[str, UserDecision] = {d.cut_id: d for d in project.user_decisions}
    for d in decisions:
        merged[d.cut_id] = UserDecision(cut_id=d.cut_id, action=d.action)
    project.user_decisions = list(merged.values())

    await asyncio.to_thread(save_project, project)

    return JSONResponse({
        "project_id": project_id,
        "decisions_updated": len(decisions),
        "message": "Decisions saved successfully"
    })


@router.patch("/projects/{project_id}/cuts/{cut_id}")
async def update_single_cut(project_id: str, cut_id: str, status: str):
    """Update a single candidate cut status."""
    project = await asyncio.to_thread(load_project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        new_status = CutStatus(status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}") from None

    found = False
    for cut in project.candidate_cuts:
        if cut.id == cut_id:
            cut.status = new_status
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail=f"Cut {cut_id} not found")

    # O(n) update using dict merge
    decisions_map: dict[str, UserDecision] = {d.cut_id: d for d in project.user_decisions}
    decisions_map[cut_id] = UserDecision(cut_id=cut_id, action=new_status)
    project.user_decisions = list(decisions_map.values())

    await asyncio.to_thread(save_project, project)
    return {"cut_id": cut_id, "status": new_status.value}


@router.delete("/projects/{project_id}")
async def delete_project_route(project_id: str):
    """Delete a project and its files."""
    import shutil
    from pathlib import Path

    success = await asyncio.to_thread(delete_project, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")

    # Clean up physical files
    BASE_DIR = Path(__file__).parent.parent.parent.parent
    for subdir in ("uploads", "exports"):
        project_dir = BASE_DIR / "data" / subdir / project_id
        if project_dir.exists() and project_dir.is_dir():
            await asyncio.to_thread(shutil.rmtree, project_dir, True)

    return {"message": "Project deleted"}
