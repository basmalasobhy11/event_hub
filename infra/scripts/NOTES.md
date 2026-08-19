
1. Podman short image names
	 Podman could not resolve images such as `maven`, `golang`, and `nginx`.
	 Solution:Used fully qualified image names such as `docker.io/library/...`.

2. Booking returned HTTP 422
 	Booking requests did not match the expected `userId` and `eventId` types.
	Solution: Sent `userId` as a string and `eventId` as a number from the frontend.

3. Dashboard did not update after booking
	 Analytics uses a Redis snapshot that was not refreshed automatically.
	Solution: Ran the analytics job to generate a fresh snapshot before checking the dashboard.


4. HEALTHCHECK warning
	 Podman displayed a warning that OCI images do not support `HEALTHCHECK`.
	Solution: Kept health checks in the Containerfiles and used readiness polling in `run-all.sh`.
