import { UserError } from "../errors";

type VariableNames =
	| "CLOUDFLARE_ACCOUNT_ID"
	| "CLOUDFLARE_API_BASE_URL"
	| "CLOUDFLARE_API_KEY"
	| "CLOUDFLARE_API_TOKEN"
	| "CLOUDFLARE_COMPLIANCE_REGION"
	| "CLOUDFLARE_EMAIL"
	| `WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_${string}`
	| "NO_HYPERDRIVE_WARNING"
	| "WRANGLER_API_ENVIRONMENT"
	| "WRANGLER_AUTH_DOMAIN"
	| "WRANGLER_AUTH_URL"
	| "WRANGLER_C3_COMMAND"
	| "WRANGLER_CF_AUTHORIZATION_TOKEN"
	| "WRANGLER_CLIENT_ID"
	| "WRANGLER_HTTPS_KEY_PATH"
	| "WRANGLER_HTTPS_CERT_PATH"
	| "WRANGLER_LOG"
	| "WRANGLER_LOG_PATH"
	| "WRANGLER_LOG_SANITIZE"
	| "WRANGLER_REVOKE_URL"
	| "WRANGLER_SEND_METRICS"
	| "WRANGLER_TOKEN_URL"
	| "WRANGLER_OUTPUT_FILE_DIRECTORY"
	| "WRANGLER_OUTPUT_FILE_PATH"
	| "WORKERS_CI_BRANCH"
	| "WRANGLER_CI_MATCH_TAG"
	| "WRANGLER_CI_OVERRIDE_NAME"
	| "WRANGLER_CI_OVERRIDE_NETWORK_MODE_HOST"
	| "WRANGLER_CI_GENERATE_PREVIEW_ALIAS"
	| "WRANGLER_BUILD_CONDITIONS"
	| "WRANGLER_BUILD_PLATFORM"
	| "WRANGLER_REGISTRY_PATH"
	| "WRANGLER_D1_EXTRA_LOCATION_CHOICES"
	| "WRANGLER_DOCKER_BIN"
	// We don't get the following using the environment variable factory,
	// but including here so that all environment variables are documented here:
	| "WRANGLER_DOCKER_HOST"
	| "DOCKER_HOST"
	| "CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV"
	| "CLOUDFLARE_INCLUDE_PROCESS_ENV";

type DeprecatedNames =
	| "CF_ACCOUNT_ID"
	| "CF_API_TOKEN"
	| "CF_API_KEY"
	| "CF_EMAIL"
	| "CF_API_BASE_URL";

type ElementType<A> = A extends readonly (infer T)[] ? T : never;

/**
 * Create a function used to access a boolean environment variable. It may return undefined if the variable is not set.
 *
 * This is not memoized to allow us to change the value at runtime, such as in testing.
 *
 * The environment variable must be either "true" or "false" (after lowercasing), otherwise it will throw an error.
 */
export function getBooleanEnvironmentVariableFactory(options: {
	variableName: VariableNames;
}): () => boolean | undefined;
export function getBooleanEnvironmentVariableFactory(options: {
	variableName: VariableNames;
	defaultValue: boolean | (() => boolean);
}): () => boolean;
export function getBooleanEnvironmentVariableFactory(options: {
	variableName: VariableNames;
	defaultValue?: boolean | (() => boolean);
}): () => boolean | undefined {
	return () => {
		if (
			!(options.variableName in process.env) ||
			process.env[options.variableName] === undefined
		) {
			return typeof options.defaultValue === "function"
				? options.defaultValue()
				: options.defaultValue;
		}

		switch (process.env[options.variableName]?.toLowerCase()) {
			case "true":
				return true;
			case "false":
				return false;
			default:
				throw new UserError(
					`Expected ${options.variableName} to be "true" or "false", but got ${JSON.stringify(
						process.env[options.variableName]
					)}`
				);
		}
	};
}

/**
 * Create a function used to access an environment variable. It may return undefined if the variable is not set.
 *
 * This is not memoized to allow us to change the value at runtime, such as in testing.
 * A warning is shown if the client is using a deprecated version - but only once.
 * If a list of choices is provided, then the environment variable must be one of those given.
 */
export function getEnvironmentVariableFactory<
	Choices extends readonly string[],
>(options: {
	variableName: VariableNames;
	deprecatedName?: DeprecatedNames;
	choices?: Choices;
}): () => ElementType<Choices> | undefined;
/**
 * Create a function used to access an environment variable, with a default value if the variable is not set.
 *
 * This is not memoized to allow us to change the value at runtime, such as in testing.
 * A warning is shown if the client is using a deprecated version - but only once.
 * If a list of choices is provided, then the environment variable must be one of those given.
 */
export function getEnvironmentVariableFactory<
	Choices extends readonly string[],
>(options: {
	variableName: VariableNames;
	deprecatedName?: DeprecatedNames;
	defaultValue: () => ElementType<Choices>;
	readonly choices?: Choices;
}): () => ElementType<Choices>;

export function getEnvironmentVariableFactory<
	Choices extends readonly string[],
>({
	variableName,
	deprecatedName,
	choices,
	defaultValue,
}: {
	variableName: VariableNames;
	deprecatedName?: DeprecatedNames;
	defaultValue?: () => ElementType<Choices>;
	readonly choices?: Choices;
}): () => ElementType<Choices> | undefined {
	let hasWarned = false;
	return () => {
		if (variableName in process.env) {
			return getProcessEnv(variableName, choices);
		}
		if (deprecatedName && deprecatedName in process.env) {
			if (!hasWarned) {
				hasWarned = true;
				// Ideally we'd use `logger.warn` here, but that creates a circular dependency that Vitest is unable to resolve
				// eslint-disable-next-line no-console
				console.warn(
					`Using "${deprecatedName}" environment variable. This is deprecated. Please use "${variableName}", instead.`
				);
			}
			return getProcessEnv(deprecatedName, choices);
		}

		return defaultValue?.();
	};
}

/**
 * Get the value of an environment variable and check it is one of the choices.
 */
function getProcessEnv<Choices extends readonly string[]>(
	variableName: string,
	choices: Choices | undefined
): ElementType<Choices> | undefined {
	assertOneOf(choices, process.env[variableName]);
	return process.env[variableName];
}

/**
 * Assert `value` is one of a list of `choices`.
 */
function assertOneOf<Choices extends readonly string[]>(
	choices: Choices | undefined,
	value: string | undefined
): asserts value is ElementType<Choices> {
	if (Array.isArray(choices) && !choices.includes(value)) {
		throw new UserError(
			`Expected ${JSON.stringify(value)} to be one of ${JSON.stringify(choices)}`
		);
	}
}
