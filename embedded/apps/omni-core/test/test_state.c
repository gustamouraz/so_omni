#include "omni/state.h"
#include <assert.h>
#include <string.h>
int main(void) {
    omni_state_t state; omni_state_init(&state);
    assert(state.wifi_enabled && state.bluetooth_enabled);
    assert(state.projection == OMNI_PROJECTION_NONE);
    assert(omni_settings_allowed(&state));
    assert(omni_connect_projection(&state, OMNI_PROJECTION_ANDROID_AUTO));
    assert(!strcmp(omni_projection_name(state.projection), "android_auto"));
    assert(omni_connect_projection(&state, OMNI_PROJECTION_CARPLAY));
    assert(state.projection == OMNI_PROJECTION_CARPLAY);
    omni_set_moving(&state, true); assert(!omni_settings_allowed(&state));
    omni_disconnect_projection(&state); assert(state.projection == OMNI_PROJECTION_NONE);
    assert(!omni_connect_projection(&state, (omni_projection_t)99));
    return 0;
}
