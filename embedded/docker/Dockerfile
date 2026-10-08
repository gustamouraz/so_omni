FROM debian:bookworm-slim

ARG BUILDROOT_VERSION=2026.05.1
ARG BUILDROOT_SHA256=ae7f706f087b9ae9083a10a587368dfbf53103c28bf81c2d690198dc4090cb58

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash bc binutils build-essential bzip2 ca-certificates cmake cpio curl file \
    findutils git gzip libncurses-dev patch perl python3 rsync sed tar unzip \
    wget which xz-utils && \
    rm -rf /var/lib/apt/lists/*

RUN curl --fail --location --retry 3 \
      "https://buildroot.org/downloads/buildroot-${BUILDROOT_VERSION}.tar.xz" \
      --output /tmp/buildroot.tar.xz && \
    echo "${BUILDROOT_SHA256}  /tmp/buildroot.tar.xz" | sha256sum --check - && \
    mkdir -p /opt/buildroot && \
    tar --extract --xz --file /tmp/buildroot.tar.xz --strip-components=1 \
      --directory /opt/buildroot && \
    rm /tmp/buildroot.tar.xz

RUN useradd --create-home --uid 1000 builder
COPY entrypoint.sh /usr/local/bin/omni-builder-entrypoint
RUN chmod 0755 /usr/local/bin/omni-builder-entrypoint

WORKDIR /opt/buildroot
ENV BR2_DL_DIR=/opt/buildroot/dl
ENTRYPOINT ["/usr/local/bin/omni-builder-entrypoint"]
