"""Projects route — CRUD operations for projects and decisions."""
from __future__ import annotations
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from voicecut.shared.models import DecisionUpdate, CutStatus
from voicecut.backend.db.database import load_project, save_project, list_projects, delete_project

router = APIRouter()


@router.get("/projects")
async def get_projects():
    """List all projects."""
    return list_projects()


@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get full project details."""
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.model_dump()


@router.patch("/projects/{project_id}/decisions")
async def update_decisions(project_id: str, decisions: list[DecisionUpdate]):
    """
    Batch update user decisions for candidate cuts.
    
    Body: [{ "cut_id": str, "status": "cut" | "kept" | "pending" | "ignored" }]
    """
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update decisions
    decision_map = {d.cut_id: d.action for d in decisions}

    # Update candidate cuts in-place
    for cut in project.candidate_cuts:
        if cut.id in decision_map:
            cut.status = decision_map[cut.id]

    # Update or add user_decisions
    existing_ids = {d.cut_id for d in project.user_decisions}
    for d in decisions:
        if d.cut_id in existing_ids:
            for existing in project.user_decisions:
                if existing.cut_id == d.cut_id:
                    existing.action = d.action
                    break
        else:
            project.user_decisions.append(d)

    save_project(project)

    return JSONResponse({
        "project_id": project_id,
        "decisions_updated": len(decisions),
        "message": "Decisions saved successfully"
    })


@router.patch("/projects/{project_id}/cuts/{cut_id}")
async def update_single_cut(project_id: str, cut_id: str, status: str):
    """Update a single candidate cut status."""
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        new_status = CutStatus(status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    found = False
    for cut in project.candidate_cuts:
        if cut.id == cut_id:
            cut.status = new_status
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail=f"Cut {cut_id} not found")

    # Update or add user decision
    updated = False
    for d in project.user_decisions:
        if d.cut_id == cut_id:
            d.action = new_status
            updated = True
            break
    if not updated:
        from voicecut.shared.models import UserDecision
        project.user_decisions.append(UserDecision(cut_id=cut_id, action=new_status))

    save_project(project)
    return {"cut_id": cut_id, "status": new_status.value}


@router.delete("/projects/{project_id}")
async def delete_project_route(project_id: str):
    """Delete a project."""
    success = delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}
