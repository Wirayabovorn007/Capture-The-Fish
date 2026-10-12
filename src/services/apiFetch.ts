/** Routes legacy action-based requests to API Gateway service paths. */
const ACTION_SERVICE: Record<string, string> = {
  "heartbeat": "users",
  "get_my_profile": "users",
  "list_users": "users",
  "suspend_user": "users",
  "unsuspend_user": "users",
  "get_my_inventory": "game",
  "list_leaderboard": "game",
  "get_public_statistics": "game",
  "submit_flag": "game",
  "list_fishes": "game",
  "list_challenges": "challenges",
  "list_admin_challenges": "challenges",
  "get_challenge": "challenges",
  "create_challenge": "challenges",
  "update_challenge": "challenges",
  "delete_challenge": "challenges",
  "import_challenges": "challenges",
  "bulk_challenge_action": "challenges",
  "spawn": "sessions",
  "status": "sessions",
  "extend_session": "sessions",
  "terminate": "sessions",
  "active": "sessions",
  "expire_session": "sessions",
  "get_story": "story",
  "get_admin_story": "story",
  "get_story_progress": "story",
  "submit_treasure_code": "story",
  "save_story": "story",
  "upload_profile_image": "assets",
  "upload_challenge_thumbnail": "assets",
  "upload_challenge_file": "assets",
  "upload_fish_image": "assets",
  "upload_story_image": "assets"
};

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof input !== "string") return fetch(input, init);
  try {
    const u = new URL(input, window.location.href);
    let action = u.searchParams.get("action");
    if (!action && typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body);
        if (typeof body.action === "string") action = body.action;
      } catch { /* Preserve original body and request. */ }
    }
    if (action && ACTION_SERVICE[action] && /\.execute-api\.[^.]+\.amazonaws\.com$/.test(u.hostname)) {
      // Mixed public/protected services use a separate JWT-protected route.
      // The Lambda still checks Cognito GetUser and Admin group as before.
      const JWT_ACTIONS = new Set(["bulk_challenge_action", "create_challenge", "delete_challenge", "get_admin_story", "get_my_inventory", "get_story_progress", "import_challenges", "list_admin_challenges", "list_fishes", "list_leaderboard", "save_story", "submit_flag", "submit_treasure_code", "update_challenge"]);
      u.pathname = (JWT_ACTIONS.has(action) ? "/auth/" : "/") + ACTION_SERVICE[action];
      return fetch(u.toString(), init);
    }
  } catch { /* Keep existing fetch behavior for non-URL inputs. */ }
  return fetch(input, init);
}
