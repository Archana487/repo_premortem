from typing import List, Optional
from pydantic import BaseModel, Field, conint, confloat

class Risk(BaseModel):
    title: str = Field(..., max_length=100, description="Short risk title (max 5 words)")
    severity: conint(ge=1, le=5) = Field(..., description="Severity score 1-5")
    location: str = Field(..., description="File path and line number reference")
    failure_mechanism: str = Field(..., description="Detailed explanation of failure chain")
    fix_suggestion: str = Field(..., description="Minimal realistic fix suggestion")

class Timeline(BaseModel):
    short_term: str = Field(..., description="Failures expected in days/weeks")
    medium_term: str = Field(..., description="Failures expected in months")
    long_term: str = Field(..., description="Failures expected in years")

class PreMortemAnalysis(BaseModel):
    architectural_summary: str = Field(..., description="High-level architecture summary")
    top_risks: List[Risk] = Field(..., min_items=1, max_items=10)
    timeline: Timeline
    scale_cliff: str = Field(..., description="Component that breaks first at 10x load")
    survival_probability: confloat(ge=0.0, le=1.0) = Field(..., description="Estimated survival probability (0-1)")
