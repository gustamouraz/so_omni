#include "omni/state.h"
#include <errno.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>

static void print_state(FILE *output, const omni_state_t *state) {
    fprintf(output, "{\"wifi\":%s,\"bluetooth\":%s,\"moving\":%s,\"projection\":\"%s\",\"settings_allowed\":%s}\n",
        state->wifi_enabled ? "true" : "false", state->bluetooth_enabled ? "true" : "false",
        state->moving ? "true" : "false", omni_projection_name(state->projection),
        omni_settings_allowed(state) ? "true" : "false");
    fflush(output);
}

static bool apply_command(omni_state_t *state, char *command) {
    command[strcspn(command, "\r\n")] = 0;
    if (!strcmp(command, "wifi on")) omni_set_wifi(state, true);
    else if (!strcmp(command, "wifi off")) omni_set_wifi(state, false);
    else if (!strcmp(command, "bluetooth on")) omni_set_bluetooth(state, true);
    else if (!strcmp(command, "bluetooth off")) omni_set_bluetooth(state, false);
    else if (!strcmp(command, "vehicle moving")) omni_set_moving(state, true);
    else if (!strcmp(command, "vehicle parked")) omni_set_moving(state, false);
    else if (!strcmp(command, "projection android_auto")) omni_connect_projection(state, OMNI_PROJECTION_ANDROID_AUTO);
    else if (!strcmp(command, "projection carplay")) omni_connect_projection(state, OMNI_PROJECTION_CARPLAY);
    else if (!strcmp(command, "projection disconnect")) omni_disconnect_projection(state);
    else return false;
    return true;
}

static bool write_state_file(const char *path, const omni_state_t *state) {
    char temporary[256];
    if (snprintf(temporary, sizeof temporary, "%s.tmp", path) >= (int)sizeof temporary) return false;
    FILE *output = fopen(temporary, "w");
    if (!output) return false;
    print_state(output, state);
    if (fclose(output) != 0 || rename(temporary, path) != 0) return false;
    return true;
}

static int run_service(const char *command_path, const char *state_path) {
    omni_state_t state;
    char command[64];
    omni_state_init(&state);
    if (mkfifo(command_path, 0600) != 0 && errno != EEXIST) return 1;
    if (!write_state_file(state_path, &state)) return 1;
    for (;;) {
        FILE *commands = fopen(command_path, "r");
        if (!commands) return 1;
        while (fgets(command, sizeof command, commands)) {
            if (apply_command(&state, command)) write_state_file(state_path, &state);
        }
        fclose(commands);
    }
}

int main(int argc, char **argv) {
    if (argc == 3) return run_service(argv[1], argv[2]);
    omni_state_t state;
    char command[64];
    omni_state_init(&state);
    print_state(stdout, &state);
    while (fgets(command, sizeof command, stdin)) {
        if (apply_command(&state, command)) print_state(stdout, &state);
        else fprintf(stderr, "unknown command: %s", command);
    }
    return 0;
}
