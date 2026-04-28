"""
Brand injection for NotebookLM workflows.

Reads company data from client-data/clients/<company>/ and generates:
1. A company context document (text source for NotebookLM)
2. Brand-aware custom instructions per artifact type

Usage:
    from brand_inject import generate_company_context, generate_brand_instructions

    company_dir = Path("client-data/clients/dukestrategies")
    context = generate_company_context(company_dir)
    instructions = generate_brand_instructions(company_dir, "audio_overview")
"""

from __future__ import annotations

import json
from pathlib import Path


def _load_json(path: Path) -> dict:
    """Load a JSON file, returning empty dict if not found."""
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def generate_company_context(company_dir: str | Path) -> str:
    """Generate a company identity document suitable as a NotebookLM text source.

    Reads profile.json and charter.json to create a comprehensive
    company context that NotebookLM can use to influence artifact generation.

    Args:
        company_dir: Path to client-data/clients/<company>/

    Returns:
        Formatted text document describing the company.
    """
    company_dir = Path(company_dir)
    profile = _load_json(company_dir / "profile.json")
    charter = _load_json(company_dir / "charter.json")

    sections: list[str] = []

    # Company identity
    company = profile.get("company", {})
    if company:
        sections.append("# Company Profile")
        if company.get("name"):
            sections.append(f"**Name**: {company['name']}")
        if company.get("tagline"):
            sections.append(f"**Tagline**: {company['tagline']}")
        if company.get("description"):
            sections.append(f"\n{company['description']}")
        hq = company.get("headquarters", {})
        if hq:
            sections.append(f"**Headquarters**: {hq.get('city', '')}, {hq.get('country', '')}")
        sections.append("")

    # Services
    services = profile.get("services", [])
    if services:
        sections.append("# Services")
        for svc in services:
            sections.append(f"## {svc.get('name', 'Service')}")
            if svc.get("description"):
                sections.append(svc["description"])
            if svc.get("industries"):
                sections.append(f"**Industries**: {', '.join(svc['industries'])}")
            sections.append("")

    # Credentials
    creds = profile.get("credentials", {})
    memberships = creds.get("memberships", [])
    if memberships:
        sections.append("# Credentials & Memberships")
        for m in memberships:
            sections.append(f"- {m.get('organization', '')} ({m.get('status', '')})")
        sections.append("")

    # Brand identity summary
    if charter:
        sections.append("# Brand Identity")
        colors = charter.get("colors", {})
        if colors.get("primary"):
            sections.append(f"**Primary color**: {colors['primary']}")
        fonts = charter.get("fonts", {})
        heading = fonts.get("heading", {})
        if heading.get("family"):
            sections.append(f"**Heading font**: {heading['family']}")
        body = fonts.get("body", {})
        if body.get("family"):
            sections.append(f"**Body font**: {body['family']}")
        sections.append("")

    return "\n".join(sections).strip()


def generate_brand_instructions(
    company_dir: str | Path,
    artifact_type: str,
) -> str:
    """Generate custom instructions for NotebookLM artifact generation.

    Creates artifact-type-specific instructions that incorporate the company's
    voice, positioning, and identity.

    Args:
        company_dir: Path to client-data/clients/<company>/
        artifact_type: Type of artifact being generated (audio_overview, video, etc.)

    Returns:
        Instructions string for the NotebookLM generation API.
    """
    company_dir = Path(company_dir)
    profile = _load_json(company_dir / "profile.json")

    company = profile.get("company", {})
    name = company.get("name", "the company")
    tagline = company.get("tagline", "")
    description = company.get("description", "")

    # Base voice context
    voice = (
        f"This content is produced by {name}"
        + (f" — {tagline}" if tagline else "")
        + ". "
    )

    # Artifact-specific instructions
    artifact_instructions = {
        "audio_overview": (
            f"{voice}"
            f"Adopt a professional, authoritative tone that reflects {name}'s expertise. "
            f"When referencing the company or its work, use the full name '{name}'. "
            "Keep the discussion substantive and insight-driven."
        ),
        "podcast": (
            f"{voice}"
            f"Adopt a professional, authoritative tone that reflects {name}'s expertise. "
            f"When referencing the company or its work, use the full name '{name}'. "
            "Keep the discussion substantive and insight-driven."
        ),
        "audio": (
            f"{voice}"
            f"Adopt a professional, authoritative tone that reflects {name}'s expertise. "
            f"When referencing the company or its work, use the full name '{name}'. "
            "Keep the discussion substantive and insight-driven."
        ),
        "video": (
            f"{voice}"
            f"Present information with the authority and clarity expected from {name}. "
            "Use clear visual explanations and maintain a professional pace."
        ),
        "slides": (
            f"{voice}"
            "Structure slides with clear headings, concise bullet points, "
            "and data-driven insights. Keep text minimal and impactful."
        ),
        "report": (
            f"{voice}"
            f"Write in {name}'s professional voice. "
            "Lead with insights and recommendations, supported by evidence."
        ),
    }

    return artifact_instructions.get(artifact_type, voice)
