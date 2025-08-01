# @cloudflare/containers-shared

## 0.2.8

### Patch Changes

- [#10061](https://github.com/cloudflare/workers-sdk/pull/10061) [`f8a80a8`](https://github.com/cloudflare/workers-sdk/commit/f8a80a807576f7fa6d9eca37d297c50793bca188) Thanks [@emily-shen](https://github.com/emily-shen)! - feat(containers): try to automatically get the socket path that the container engine is listening on.

  Currently, if your container engine isn't set up to listen on `unix:///var/run/docker.sock` (or isn't symlinked to that), then you have to manually set this via the `dev.containerEngine` field in your Wrangler config, or via the env vars `WRANGLER_DOCKER_HOST`. This change means that we will try and get the socket of the current context automatically. This should reduce the occurrence of opaque `internal error`s thrown by the runtime when the daemon is not listening on `unix:///var/run/docker.sock`.

  In addition to `WRANGLER_DOCKER_HOST`, `DOCKER_HOST` can now also be used to set the container engine socket address.

## 0.2.7

### Patch Changes

- [#9819](https://github.com/cloudflare/workers-sdk/pull/9819) [`0c4008c`](https://github.com/cloudflare/workers-sdk/commit/0c4008ce183c82ebff8eac2469ff9a8256cffa5f) Thanks [@CarmenPopoviciu](https://github.com/CarmenPopoviciu)! - feat(vite-plugin): Add containers support in `vite dev`

  Adds support for Cloudflare Containers in `vite dev`. Please note that at the time of this PR a container image can only specify the path to a `Dockerfile`. Support for registry links will be added in a later version, as will containers support in `vite preview`.

## 0.2.6

### Patch Changes

- [#9925](https://github.com/cloudflare/workers-sdk/pull/9925) [`b46386c`](https://github.com/cloudflare/workers-sdk/commit/b46386c0b245ef1d64e6e7dcff4e421002a3158c) Thanks [@dario-piotrowicz](https://github.com/dario-piotrowicz)! - clarify the docker build error message

## 0.2.5

### Patch Changes

- [#9833](https://github.com/cloudflare/workers-sdk/pull/9833) [`3743896`](https://github.com/cloudflare/workers-sdk/commit/3743896120baa530c1b6d4cb7eeda27847b2db44) Thanks [@dario-piotrowicz](https://github.com/dario-piotrowicz)! - extend `prepareContainerImagesForDev` to allow aborting a container's build process

- [#9923](https://github.com/cloudflare/workers-sdk/pull/9923) [`c01c4ee`](https://github.com/cloudflare/workers-sdk/commit/c01c4ee6affd0acf2f678d9c562f4a7d6db82465) Thanks [@gpanders](https://github.com/gpanders)! - Fix image name resolution when modifying a container application

## 0.2.4

### Patch Changes

- [#9888](https://github.com/cloudflare/workers-sdk/pull/9888) [`d2fe58b`](https://github.com/cloudflare/workers-sdk/commit/d2fe58b33a3172e204ff3a477c4a0d33ab8f2c76) Thanks [@IRCody](https://github.com/IRCody)! - Remove undici dependency from @cloudflare/containers-shared

- [#9879](https://github.com/cloudflare/workers-sdk/pull/9879) [`e10c3e2`](https://github.com/cloudflare/workers-sdk/commit/e10c3e2a6b3049d23b58cbc63eef1756233cf9c3) Thanks [@dario-piotrowicz](https://github.com/dario-piotrowicz)! - fix: enable Dockerfile exposed port validation on linux as well

- [#9879](https://github.com/cloudflare/workers-sdk/pull/9879) [`e10c3e2`](https://github.com/cloudflare/workers-sdk/commit/e10c3e2a6b3049d23b58cbc63eef1756233cf9c3) Thanks [@dario-piotrowicz](https://github.com/dario-piotrowicz)! - update error message presented when no port is exported by the image

## 0.2.3

### Patch Changes

- [#9872](https://github.com/cloudflare/workers-sdk/pull/9872) [`a727db3`](https://github.com/cloudflare/workers-sdk/commit/a727db341a811572623e0a0f361f070a95758776) Thanks [@emily-shen](https://github.com/emily-shen)! - fix: resolve Dockerfile path relative to the Wrangler config path

  This fixes a bug where Wrangler would not be able to find a Dockerfile if a Wrangler config path had been specified with the `--config` flag.

## 0.2.2

### Patch Changes

- [#9718](https://github.com/cloudflare/workers-sdk/pull/9718) [`fb83341`](https://github.com/cloudflare/workers-sdk/commit/fb83341bed6ff6571519eb117db19e3e76a83215) Thanks [@mhart](https://github.com/mhart)! - fix error message when docker daemon is not running

## 0.2.1

### Patch Changes

- [#9596](https://github.com/cloudflare/workers-sdk/pull/9596) [`5162c51`](https://github.com/cloudflare/workers-sdk/commit/5162c5194604f26b2e5018961b761f3450872333) Thanks [@CarmenPopoviciu](https://github.com/CarmenPopoviciu)! - add ability to pull images for containers local dev

## 0.2.0

### Minor Changes

- [#9675](https://github.com/cloudflare/workers-sdk/pull/9675) [`caf97e4`](https://github.com/cloudflare/workers-sdk/commit/caf97e40e5c9d765dcf0bd716cd81d986c496bdc) Thanks [@emily-shen](https://github.com/emily-shen)! - `containers-shared` contains shared code relating to containers that is used across `workers-sdk`.

### Patch Changes

- [#9653](https://github.com/cloudflare/workers-sdk/pull/9653) [`8a60fe7`](https://github.com/cloudflare/workers-sdk/commit/8a60fe76ec5ecc734c0eb9f31b4d60e86d5cb06d) Thanks [@penalosa](https://github.com/penalosa)! - Rename `WRANGLER_CONTAINERS_DOCKER_PATH` to `WRANGLER_DOCKER_BIN`

- [#9653](https://github.com/cloudflare/workers-sdk/pull/9653) [`8a60fe7`](https://github.com/cloudflare/workers-sdk/commit/8a60fe76ec5ecc734c0eb9f31b4d60e86d5cb06d) Thanks [@penalosa](https://github.com/penalosa)! - Add a warning banner to `wrangler cloudchamber` and `wrangler containers` commands

- [#9605](https://github.com/cloudflare/workers-sdk/pull/9605) [`17d23d8`](https://github.com/cloudflare/workers-sdk/commit/17d23d8e5fd54737d1c4b9cb487fd6e85cddc9c8) Thanks [@emily-shen](https://github.com/emily-shen)! - Add rebuild hotkey for containers local dev, and clean up containers at the end of a dev session.
