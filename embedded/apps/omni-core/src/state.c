#include "omni/state.h"
void omni_state_init(omni_state_t *state) {
    if (!state) return;
    state->bluetooth_enabled = true; state->moving = false;
    state->projection = OMNI_PROJECTION_NONE; state->wifi_enabled = true;
}
void omni_set_bluetooth(omni_state_t *state, bool enabled) { if (state) state->bluetooth_enabled = enabled; }
void omni_set_moving(omni_state_t *state, bool moving) { if (state) state->moving = moving; }
void omni_set_wifi(omni_state_t *state, bool enabled) { if (state) state->wifi_enabled = enabled; }
bool omni_connect_projection(omni_state_t *state, omni_projection_t projection) {
    if (!state || projection <= OMNI_PROJECTION_NONE || projection > OMNI_PROJECTION_CARPLAY) return false;
    state->projection = projection; return true;
}
void omni_disconnect_projection(omni_state_t *state) { if (state) state->projection = OMNI_PROJECTION_NONE; }
bool omni_settings_allowed(const omni_state_t *state) { return state && !state->moving; }
const char *omni_projection_name(omni_projection_t projection) {
    switch (projection) {
        case OMNI_PROJECTION_ANDROID_AUTO: return "android_auto";
        case OMNI_PROJECTION_CARPLAY: return "carplay";
        default: return "none";
    }
}
