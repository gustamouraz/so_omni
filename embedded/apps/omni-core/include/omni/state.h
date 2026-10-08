#ifndef OMNI_STATE_H
#define OMNI_STATE_H
#include <stdbool.h>
typedef enum { OMNI_PROJECTION_NONE = 0, OMNI_PROJECTION_ANDROID_AUTO, OMNI_PROJECTION_CARPLAY } omni_projection_t;
typedef struct { bool bluetooth_enabled; bool moving; bool wifi_enabled; omni_projection_t projection; } omni_state_t;
void omni_state_init(omni_state_t *state);
void omni_set_bluetooth(omni_state_t *state, bool enabled);
void omni_set_moving(omni_state_t *state, bool moving);
void omni_set_wifi(omni_state_t *state, bool enabled);
bool omni_connect_projection(omni_state_t *state, omni_projection_t projection);
void omni_disconnect_projection(omni_state_t *state);
bool omni_settings_allowed(const omni_state_t *state);
const char *omni_projection_name(omni_projection_t projection);
#endif
