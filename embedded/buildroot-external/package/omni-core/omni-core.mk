################################################################################
# omni-core
################################################################################
OMNI_CORE_VERSION = 0.2.1
OMNI_CORE_SITE = $(BR2_EXTERNAL_OMNI_PATH)/../apps/omni-core
OMNI_CORE_SITE_METHOD = local
OMNI_CORE_INSTALL_STAGING = NO
OMNI_CORE_CONF_OPTS = -DBUILD_TESTING=OFF -DCMAKE_BUILD_TYPE=Release

define OMNI_CORE_INSTALL_BRANDING
	$(INSTALL) -D -m 0644 \
		$(BR2_EXTERNAL_OMNI_PATH)/../../assets/branding/omni-icon.png \
		$(TARGET_DIR)/usr/share/omni/omni-icon.png
endef
OMNI_CORE_POST_INSTALL_TARGET_HOOKS += OMNI_CORE_INSTALL_BRANDING

$(eval $(cmake-package))
