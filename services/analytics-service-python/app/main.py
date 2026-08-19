import asyncio
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .redis_client import read_snapshot, write_snapshot
from .snapshot import compute_snapshot

app = FastAPI(title="analytics-service")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("analytics-service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/analytics/summary")
def summary():
    snapshot = read_snapshot()

    if snapshot is None:
        raise HTTPException(
            status_code=503,
            detail="no analytics snapshot yet -- computing now",
        )

    return snapshot


async def refresh_snapshot():
    while True:
        try:
            snapshot = await asyncio.to_thread(compute_snapshot)
            write_snapshot(snapshot)
            logger.info("analytics snapshot refreshed")
        except Exception as err:
            logger.error("failed to refresh analytics snapshot: %s", err)

        await asyncio.sleep(10)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(refresh_snapshot())
