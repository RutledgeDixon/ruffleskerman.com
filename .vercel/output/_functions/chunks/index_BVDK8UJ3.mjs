import fs$1, { existsSync, readFileSync, cpSync, mkdirSync } from 'node:fs';
import path, { dirname, join, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as fs from 'node:fs/promises';
import { getTransformedRoutes, normalizeRoutes } from '@vercel/routing-utils';
import { ap as AstroUserError } from './astro/server_BAyaMtYH.mjs';
import { globSync } from 'tinyglobby';
import { b as appendForwardSlash, i as isRemotePath, g as removeLeadingForwardSlash } from './index_aYWP_-NP.mjs';
import 'deterministic-object-hash';
import { builtinModules } from 'node:module';

async function writeJson(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, "	"), { encoding: "utf-8" });
}
async function removeDir(dir) {
  await fs.rm(dir, { recursive: true, force: true, maxRetries: 3 });
}
async function emptyDir(dir) {
  await removeDir(dir);
  await fs.mkdir(dir, { recursive: true });
}
async function copyFilesToFolder(files, outDir, exclude = []) {
  const excludeList = exclude.map((url) => fileURLToPath(url));
  const fileList = files.map((url) => fileURLToPath(url)).filter((f) => !excludeList.includes(f));
  if (files.length === 0) throw new Error("No files found to copy");
  let commonAncestor = path.dirname(fileList[0]);
  for (const file of fileList.slice(1)) {
    while (!file.startsWith(commonAncestor)) {
      commonAncestor = path.dirname(commonAncestor);
    }
  }
  for (const origin of fileList) {
    const dest = new URL(path.relative(commonAncestor, origin), outDir);
    const realpath = await fs.realpath(origin);
    const isSymlink = realpath !== origin;
    const isDir = (await fs.stat(origin)).isDirectory();
    if (isDir && !isSymlink) {
      await fs.mkdir(new URL("..", dest), { recursive: true });
    } else {
      await fs.mkdir(new URL(".", dest), { recursive: true });
    }
    if (isSymlink) {
      const realdest = fileURLToPath(new URL(path.relative(commonAncestor, realpath), outDir));
      const target = path.relative(fileURLToPath(new URL(".", dest)), realdest);
      if (!existsSync(dest)) {
        await fs.symlink(target, dest, isDir ? "dir" : "file");
      }
    } else if (!isDir) {
      await fs.copyFile(origin, dest);
    }
  }
  return commonAncestor;
}

function getDefaultImageConfig(astroImageConfig) {
  return {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: astroImageConfig.domains ?? [],
    // Cast is necessary here because Vercel's types are slightly different from ours regarding allowed protocols. Behavior should be the same, however.
    remotePatterns: astroImageConfig.remotePatterns ?? []
  };
}
function getAstroImageConfig(images, imagesConfig, command, devImageService, astroImageConfig) {
  let devService = "@astrojs/vercel/dev-image-service";
  switch (devImageService) {
    case "sharp":
      devService = "@astrojs/vercel/dev-image-service";
      break;
    default:
      if (typeof devImageService === "string") {
        devService = devImageService;
      } else {
        devService = "@astrojs/vercel/dev-image-service";
      }
      break;
  }
  if (images) {
    const config = imagesConfig ? imagesConfig : getDefaultImageConfig(astroImageConfig);
    return {
      image: {
        service: {
          entrypoint: command === "dev" ? devService : "@astrojs/vercel/build-image-service",
          config
        },
        breakpoints: config.sizes
      }
    };
  }
  return {};
}

const ROOT_FILES = [
  // '.git',
  // https://pnpm.io/workspaces/
  "pnpm-workspace.yaml",
  // https://rushjs.io/pages/advanced/config_files/
  // 'rush.json',
  // https://nx.dev/latest/react/getting-started/nx-setup
  // 'workspace.json',
  // 'nx.json',
  // https://github.com/lerna/lerna#lernajson
  "lerna.json"
];
function tryStatSync(file) {
  try {
    return fs$1.statSync(file, {
      throwIfNoEntry: false
    });
  } catch {
  }
}
function isFileReadable(filename) {
  if (!tryStatSync(filename)) {
    return false;
  }
  try {
    fs$1.accessSync(filename, fs$1.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
function hasWorkspacePackageJSON(root) {
  const path = join(root, "package.json");
  if (!isFileReadable(path)) {
    return false;
  }
  try {
    const content = JSON.parse(fs$1.readFileSync(path, "utf-8")) || {};
    return !!content.workspaces;
  } catch {
    return false;
  }
}
function hasRootFile(root) {
  return ROOT_FILES.some((file) => fs$1.existsSync(join(root, file)));
}
function hasPackageJSON(root) {
  const path = join(root, "package.json");
  return fs$1.existsSync(path);
}
function searchForPackageRoot(current, root = current) {
  if (hasPackageJSON(current)) return current;
  const dir = dirname(current);
  if (!dir || dir === current) return root;
  return searchForPackageRoot(dir, root);
}
function searchForWorkspaceRoot(current, root = searchForPackageRoot(current)) {
  if (hasRootFile(current)) return current;
  if (hasWorkspacePackageJSON(current)) return current;
  const dir = dirname(current);
  if (!dir || dir === current) return root;
  return searchForWorkspaceRoot(dir, root);
}

async function copyDependenciesToFunction({
  entry,
  outDir,
  includeFiles,
  excludeFiles,
  logger,
  root
}, cache) {
  const entryPath = fileURLToPath(entry);
  logger.info(`Bundling function ${relative(fileURLToPath(outDir), entryPath)}`);
  const base = pathToFileURL(appendForwardSlash(searchForWorkspaceRoot(fileURLToPath(root))));
  const { nodeFileTrace } = await import('@vercel/nft');
  const result = await nodeFileTrace([entryPath], {
    base: fileURLToPath(base),
    cache
  });
  for (const error of result.warnings) {
    if (error.message.startsWith("Failed to resolve dependency")) {
      const [, module, file] = /Cannot find module '(.+?)' loaded from (.+)/.exec(error.message);
      if (module === "@astrojs/") continue;
      if (module === "sharp") continue;
      if (entryPath === file) {
        logger.debug(
          `[@astrojs/vercel] The module "${module}" couldn't be resolved. This may not be a problem, but it's worth checking.`
        );
      } else {
        logger.debug(
          `[@astrojs/vercel] The module "${module}" inside the file "${file}" couldn't be resolved. This may not be a problem, but it's worth checking.`
        );
      }
    } else if (error.message.startsWith("Failed to parse")) {
      continue;
    } else {
      throw error;
    }
  }
  const commonAncestor = await copyFilesToFolder(
    [...result.fileList].map((file) => new URL(file, base)).concat(includeFiles),
    outDir,
    excludeFiles
  );
  return {
    // serverEntry location inside the outDir
    handler: relative(commonAncestor, entryPath)
  };
}

const pathJoin = path.posix.join;
const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function getMatchPattern(segments) {
  return segments.map((segment) => {
    return segment.map((part) => {
      if (part.spread) {
        const paramName = part.content.startsWith("...") ? part.content.slice(3) : part.content;
        return `:${paramName}*`;
      }
      if (part.dynamic) {
        return `:${part.content}`;
      }
      return part.content;
    }).join("");
  }).join("/");
}
function getMatchRegex(segments) {
  return segments.map((segment, segmentIndex) => {
    return segment.length === 1 && segment[0].spread ? "(?:\\/(.*?))?" : (
      // Omit leading slash if segment is a spread.
      // This is handled using a regex in Astro core.
      // To avoid complex data massaging, we handle in-place here.
      (segmentIndex === 0 ? "" : "/") + segment.map((part) => {
        if (part)
          return part.spread ? "(.*?)" : part.dynamic ? "([^/]+?)" : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[*+?^${}()|[\]\\]/g, "\\$&");
      }).join("")
    );
  }).join("");
}
function getRedirectLocation(route, config) {
  if (route.redirectRoute) {
    const pattern = getMatchPattern(route.redirectRoute.segments);
    return pathJoin(config.base, pattern);
  }
  const destination = typeof route.redirect === "object" ? route.redirect.destination : route.redirect ?? "";
  if (isRemotePath(destination)) {
    return destination;
  }
  return pathJoin(config.base, destination);
}
function getRedirectStatus(route) {
  if (typeof route.redirect === "object") {
    return route.redirect.status;
  }
  return 301;
}
function escapeRegex(content) {
  const segments = removeLeadingForwardSlash(content).split(path.posix.sep).filter(Boolean).map((s) => {
    return getParts(s, content);
  });
  return `^/${getMatchRegex(segments)}$`;
}
function getRedirects(routes, config) {
  const redirects = [];
  for (const route of routes) {
    if (route.type === "redirect") {
      redirects.push({
        source: config.base + getMatchPattern(route.segments),
        destination: getRedirectLocation(route, config),
        statusCode: getRedirectStatus(route)
      });
    }
  }
  return redirects;
}

async function getInjectableWebAnalyticsContent({
  mode
}) {
  const base = `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`;
  if (mode === "development") {
    return `
			${base}
			var script = document.createElement('script');
			script.defer = true;
			script.src = 'https://cdn.vercel-insights.com/v1/script.debug.js';
			var head = document.querySelector('head');
			head.appendChild(script);
		`;
  }
  return `${base}
		var script = document.createElement('script');
		script.defer = true;
		script.src = '/_vercel/insights/script.js';
		var head = document.querySelector('head');
		head.appendChild(script);
	`;
}

async function generateEdgeMiddleware(astroMiddlewareEntryPointPath, root, vercelEdgeMiddlewareHandlerPath, outPath, middlewareSecret, logger) {
  const code = edgeMiddlewareTemplate(
    astroMiddlewareEntryPointPath,
    vercelEdgeMiddlewareHandlerPath,
    middlewareSecret,
    logger
  );
  const bundledFilePath = fileURLToPath(outPath);
  const esbuild = await import('esbuild');
  await esbuild.build({
    stdin: {
      contents: code,
      resolveDir: fileURLToPath(root)
    },
    // Vercel Edge runtime targets ESNext, because Cloudflare Workers update v8 weekly
    // https://github.com/vercel/vercel/blob/1006f2ae9d67ea4b3cbb1073e79d14d063d42436/packages/next/scripts/build-edge-function-template.js
    target: "esnext",
    platform: "browser",
    // esbuild automatically adds the browser, import and default conditions
    // https://esbuild.github.io/api/#conditions
    // https://runtime-keys.proposal.wintercg.org/#edge-light
    conditions: ["edge-light", "workerd", "worker"],
    outfile: bundledFilePath,
    allowOverwrite: true,
    format: "esm",
    bundle: true,
    minify: false,
    // ensure node built-in modules are namespaced with `node:`
    plugins: [
      {
        name: "esbuild-namespace-node-built-in-modules",
        setup(build) {
          const filter = new RegExp(builtinModules.map((mod) => `(^${mod}$)`).join("|"));
          build.onResolve(
            {
              filter
            },
            (args) => ({
              path: "node:" + args.path,
              external: true
            })
          );
        }
      }
    ]
  });
  return pathToFileURL(bundledFilePath);
}
function edgeMiddlewareTemplate(astroMiddlewareEntryPointPath, vercelEdgeMiddlewareHandlerPath, middlewareSecret, logger) {
  const middlewarePath = JSON.stringify(
    fileURLToPath(astroMiddlewareEntryPointPath).replace(/\\/g, "/")
  );
  const filePathEdgeMiddleware = fileURLToPath(vercelEdgeMiddlewareHandlerPath);
  let handlerTemplateImport = "";
  let handlerTemplateCall = "{}";
  if (existsSync(filePathEdgeMiddleware + ".js") || existsSync(filePathEdgeMiddleware + ".ts")) {
    logger.warn(
      "Usage of `vercel-edge-middleware.js` is deprecated. You can now use the `waitUntil(promise)` function directly as `ctx.locals.waitUntil(promise)`."
    );
    const stringified = JSON.stringify(filePathEdgeMiddleware.replace(/\\/g, "/"));
    handlerTemplateImport = `import handler from ${stringified}`;
    handlerTemplateCall = `await handler({ request, context })`;
  }
  return `
	${handlerTemplateImport}
import { onRequest } from ${middlewarePath};
import { createContext, trySerializeLocals } from 'astro/middleware';
export default async function middleware(request, context) {
	const ctx = createContext({
		request,
		params: {}
	});
	Object.assign(ctx.locals, { vercel: { edge: context }, ...${handlerTemplateCall} });
	const { origin } = new URL(request.url);
	const next = async () => {
		const { vercel, ...locals } = ctx.locals;
		const response = await fetch(new URL('/${NODE_PATH}', request.url), {
			headers: {
				...Object.fromEntries(request.headers.entries()),
				'${ASTRO_MIDDLEWARE_SECRET_HEADER}': '${middlewareSecret}',
				'${ASTRO_PATH_HEADER}': request.url.replace(origin, ''),
				'${ASTRO_LOCALS_HEADER}': trySerializeLocals(locals)
			}
		});
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	};

	const response = await onRequest(ctx, next);
	// Append cookies from Astro.cookies
	for(const setCookieHeaderValue of ctx.cookies.headers()) {
		response.headers.append('set-cookie', setCookieHeaderValue);
	}
	return response;
}`;
}

const PACKAGE_NAME = "@astrojs/vercel";
const ASTRO_PATH_HEADER = "x-astro-path";
const ASTRO_PATH_PARAM = "x_astro_path";
const ASTRO_LOCALS_HEADER = "x-astro-locals";
const ASTRO_MIDDLEWARE_SECRET_HEADER = "x-astro-middleware-secret";
const VERCEL_EDGE_MIDDLEWARE_FILE = "vercel-edge-middleware";
const NODE_PATH = "_render";
const MIDDLEWARE_PATH = "_middleware";
const ISR_PATH = `/_isr?${ASTRO_PATH_PARAM}=$0`;
const SUPPORTED_NODE_VERSIONS = {
  18: {
    status: "deprecated"
  },
  20: {
    status: "available"
  },
  22: {
    status: "default"
  }
};
function getAdapter({
  edgeMiddleware,
  middlewareSecret,
  skewProtection,
  buildOutput,
  experimentalStaticHeaders
}) {
  return {
    name: PACKAGE_NAME,
    serverEntrypoint: `${PACKAGE_NAME}/entrypoint`,
    exports: ["default"],
    args: {
      middlewareSecret,
      skewProtection
    },
    adapterFeatures: {
      edgeMiddleware,
      buildOutput,
      experimentalStaticHeaders
    },
    supportedAstroFeatures: {
      hybridOutput: "stable",
      staticOutput: "stable",
      serverOutput: "stable",
      sharpImageService: "stable",
      i18nDomains: "experimental",
      envGetSecret: "stable"
    },
    client: {
      internalFetchHeaders: skewProtection ? () => {
        const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
        if (deploymentId) {
          return { "x-deployment-id": deploymentId };
        }
        return {};
      } : void 0,
      assetQueryParams: skewProtection && process.env.VERCEL_DEPLOYMENT_ID ? new URLSearchParams({ dpl: process.env.VERCEL_DEPLOYMENT_ID }) : void 0
    }
  };
}
function vercelAdapter({
  webAnalytics,
  includeFiles: _includeFiles = [],
  excludeFiles: _excludeFiles = [],
  imageService,
  imagesConfig,
  devImageService = "sharp",
  edgeMiddleware = false,
  maxDuration,
  isr = false,
  skewProtection = process.env.VERCEL_SKEW_PROTECTION_ENABLED === "1",
  experimentalStaticHeaders = false
} = {}) {
  if (maxDuration) {
    if (typeof maxDuration !== "number") {
      throw new TypeError(`maxDuration must be a number`, {
        cause: maxDuration
      });
    }
    if (maxDuration <= 0) {
      throw new TypeError(`maxDuration must be a positive number`, {
        cause: maxDuration
      });
    }
  }
  let _config;
  let _buildTempFolder;
  let _serverEntry;
  let _entryPoints;
  let _middlewareEntryPoint;
  let _routeToHeaders = void 0;
  const extraFilesToInclude = [];
  const middlewareSecret = crypto.randomUUID();
  let _buildOutput;
  let staticDir;
  let routes;
  return {
    name: PACKAGE_NAME,
    hooks: {
      "astro:config:setup": async ({ command, config, updateConfig, injectScript, logger }) => {
        if (webAnalytics?.enabled) {
          injectScript(
            "head-inline",
            await getInjectableWebAnalyticsContent({
              mode: command === "dev" ? "development" : "production"
            })
          );
        }
        staticDir = new URL("./.vercel/output/static", config.root);
        updateConfig({
          build: {
            format: "directory",
            redirects: false
          },
          integrations: [
            {
              name: "astro:copy-vercel-output",
              hooks: {
                "astro:build:done": async () => {
                  logger.info("Copying static files to .vercel/output/static");
                  const _staticDir = _buildOutput === "static" ? _config.outDir : _config.build.client;
                  cpSync(_staticDir, new URL("./.vercel/output/static/", _config.root), {
                    recursive: true
                  });
                }
              }
            }
          ],
          vite: {
            ssr: {
              external: ["@vercel/nft"]
            }
          },
          ...getAstroImageConfig(
            imageService,
            imagesConfig,
            command,
            devImageService,
            config.image
          )
        });
      },
      "astro:routes:resolved": (params) => {
        routes = params.routes;
      },
      "astro:config:done": ({ setAdapter, config, logger, buildOutput }) => {
        _buildOutput = buildOutput;
        if (_buildOutput === "server") {
          if (maxDuration && maxDuration > 900) {
            logger.warn(
              `maxDuration is set to ${maxDuration} seconds, which is longer than the maximum allowed duration of 900 seconds.`
            );
            logger.warn(
              `Please make sure that your plan allows for this duration. See https://vercel.com/docs/functions/serverless-functions/runtimes#maxduration for more information.`
            );
          }
          const vercelConfigPath = new URL("vercel.json", config.root);
          if (config.trailingSlash && config.trailingSlash !== "ignore" && existsSync(vercelConfigPath)) {
            try {
              const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, "utf-8"));
              if (vercelConfig.trailingSlash === true && config.trailingSlash === "never" || vercelConfig.trailingSlash === false && config.trailingSlash === "always") {
                logger.error(
                  `
	Your "vercel.json" \`trailingSlash\` configuration (set to \`${vercelConfig.trailingSlash}\`) will conflict with your Astro \`trailingSlash\` configuration (set to \`${JSON.stringify(config.trailingSlash)}\`).
	This would cause infinite redirects or duplicate content issues. 
	Please remove the \`trailingSlash\` configuration from your \`vercel.json\` file or Astro config.
`
                );
              }
            } catch (_err) {
              logger.warn(`Your "vercel.json" config is not a valid json file.`);
            }
          }
          setAdapter(
            getAdapter({
              buildOutput: _buildOutput,
              edgeMiddleware,
              middlewareSecret,
              skewProtection,
              experimentalStaticHeaders
            })
          );
        } else {
          setAdapter(
            getAdapter({
              edgeMiddleware: false,
              middlewareSecret: "",
              skewProtection,
              buildOutput: _buildOutput,
              experimentalStaticHeaders
            })
          );
        }
        _config = config;
        _buildTempFolder = config.build.server;
        _serverEntry = config.build.serverEntry;
      },
      "astro:build:start": async () => {
        await emptyDir(new URL("./.vercel/output/", _config.root));
      },
      "astro:build:ssr": async ({ entryPoints, middlewareEntryPoint }) => {
        _entryPoints = new Map(
          Array.from(entryPoints).filter(([routeData]) => !routeData.prerender).map(([routeData, url]) => [
            {
              entrypoint: routeData.component,
              patternRegex: routeData.pattern
            },
            url
          ])
        );
        _middlewareEntryPoint = middlewareEntryPoint;
      },
      "astro:build:generated": ({ experimentalRouteToHeaders }) => {
        _routeToHeaders = experimentalRouteToHeaders;
      },
      "astro:build:done": async ({ logger }) => {
        const outDir = new URL("./.vercel/output/", _config.root);
        if (staticDir) {
          if (existsSync(staticDir)) {
            emptyDir(staticDir);
          }
          mkdirSync(new URL("./.vercel/output/static/", _config.root), {
            recursive: true
          });
          mkdirSync(new URL("./.vercel/output/server/", _config.root));
          if (_buildOutput !== "static") {
            cpSync(_config.build.server, new URL("./.vercel/output/_functions/", _config.root), {
              recursive: true
            });
          }
        }
        const routeDefinitions = [];
        if (_buildOutput === "server") {
          if (_config.vite.assetsInclude) {
            const mergeGlobbedIncludes = (globPattern) => {
              if (typeof globPattern === "string") {
                const entries = globSync(globPattern).map((p) => pathToFileURL(p));
                extraFilesToInclude.push(...entries);
              } else if (Array.isArray(globPattern)) {
                for (const pattern of globPattern) {
                  mergeGlobbedIncludes(pattern);
                }
              }
            };
            mergeGlobbedIncludes(_config.vite.assetsInclude);
          }
          const includeFiles = _includeFiles.map((file) => new URL(file, _config.root)).concat(extraFilesToInclude);
          const excludeFiles = _excludeFiles.map((file) => new URL(file, _config.root));
          const builder = new VercelBuilder(
            _config,
            excludeFiles,
            includeFiles,
            logger,
            outDir,
            maxDuration
          );
          if (_entryPoints.size) {
            const getRouteFuncName = (route) => route.entrypoint.replace("src/pages/", "");
            const getFallbackFuncName = (entryFile) => basename(entryFile.toString()).replace("entry.", "").replace(/\.mjs$/, "");
            for (const [route, entryFile] of _entryPoints) {
              const func = route.entrypoint.startsWith("src/pages/") ? getRouteFuncName(route) : getFallbackFuncName(entryFile);
              await builder.buildServerlessFolder(entryFile, func, _config.root);
              routeDefinitions.push({
                src: route.patternRegex.source,
                dest: func
              });
            }
          } else {
            const entryFile = new URL(_serverEntry, _buildTempFolder);
            if (isr) {
              const isrConfig = typeof isr === "object" ? isr : {};
              await builder.buildServerlessFolder(entryFile, NODE_PATH, _config.root);
              if (isrConfig.exclude?.length) {
                const expandedExclusions = isrConfig.exclude.reduce((acc, exclusion) => {
                  if (exclusion instanceof RegExp) {
                    return [
                      ...acc,
                      ...routes.filter((route) => exclusion.test(route.pattern)).map((route) => route.pattern)
                    ];
                  }
                  return [...acc, exclusion];
                }, []);
                const dest = _middlewareEntryPoint ? MIDDLEWARE_PATH : NODE_PATH;
                for (const route of expandedExclusions) {
                  routeDefinitions.push({
                    src: escapeRegex(route),
                    dest
                  });
                }
              }
              await builder.buildISRFolder(entryFile, "_isr", isrConfig, _config.root);
              for (const route of routes) {
                const excludeRouteFromIsr = isrConfig.exclude?.some((exclusion) => {
                  if (exclusion instanceof RegExp) {
                    return exclusion.test(route.pattern);
                  }
                  return exclusion === route.pattern;
                });
                if (!excludeRouteFromIsr) {
                  const src = route.patternRegex.source;
                  const dest = src.startsWith("^\\/_image") || src.startsWith("^\\/_server-islands") ? NODE_PATH : ISR_PATH;
                  if (!route.isPrerendered)
                    routeDefinitions.push({
                      src,
                      dest
                    });
                }
              }
            } else {
              await builder.buildServerlessFolder(entryFile, NODE_PATH, _config.root);
              const dest = _middlewareEntryPoint ? MIDDLEWARE_PATH : NODE_PATH;
              for (const route of routes) {
                if (!route.isPrerendered)
                  routeDefinitions.push({
                    src: route.patternRegex.source,
                    dest
                  });
              }
            }
          }
          if (_middlewareEntryPoint) {
            await builder.buildMiddlewareFolder(
              _middlewareEntryPoint,
              MIDDLEWARE_PATH,
              middlewareSecret
            );
          }
        }
        const fourOhFourRoute = routes.find((route) => route.pathname === "/404");
        const vercelConfigJson = new URL("./.vercel/output/config.json", _config.root);
        const finalRoutes = [
          {
            src: `^/${_config.build.assets}/(.*)$`,
            headers: {
              "cache-control": "public, max-age=31536000, immutable"
            },
            continue: true
          }
        ];
        if (_buildOutput === "server") {
          finalRoutes.push(...routeDefinitions);
        }
        if (fourOhFourRoute) {
          if (_buildOutput === "server") {
            finalRoutes.push({
              src: "/.*",
              dest: fourOhFourRoute.isPrerendered ? "/404.html" : _middlewareEntryPoint ? MIDDLEWARE_PATH : NODE_PATH,
              status: 404
            });
          } else {
            finalRoutes.push({
              src: "/.*",
              dest: "/404.html",
              status: 404
            });
          }
        }
        let trailingSlash;
        if (_config.trailingSlash && _config.trailingSlash !== "ignore") {
          trailingSlash = _config.trailingSlash === "always";
        }
        const { routes: redirects = [], error } = getTransformedRoutes({
          trailingSlash,
          rewrites: [],
          redirects: getRedirects(routes, _config),
          headers: []
        });
        if (error) {
          throw new AstroUserError(
            `Error generating redirects: ${error.message}`,
            error.link ? `${error.action ?? "More info"}: ${error.link}` : void 0
          );
        }
        let images;
        if (imagesConfig) {
          images = {
            ...imagesConfig,
            domains: imagesConfig.domains || _config.image.domains ? [...imagesConfig.domains ?? [], ..._config.image.domains ?? []] : void 0,
            remotePatterns: [...imagesConfig.remotePatterns ?? []]
          };
          const remotePatterns = _config.image.remotePatterns;
          for (const pattern of remotePatterns) {
            if (isAcceptedPattern(pattern)) {
              images.remotePatterns?.push(pattern);
            }
          }
        } else if (imageService) {
          images = getDefaultImageConfig(_config.image);
        }
        const normalized = normalizeRoutes([...redirects ?? [], ...finalRoutes]);
        if (normalized.error) {
          throw new AstroUserError(
            `Error generating routes: ${normalized.error.message}`,
            normalized.error.link ? `${normalized.error.action ?? "More info"}: ${normalized.error.link}` : void 0
          );
        }
        if (_routeToHeaders && _routeToHeaders.size > 0) {
          if (!normalized.routes) {
            normalized.routes = [];
          }
          if (experimentalStaticHeaders) {
            const routesWithConfigHeaders = createRoutesWithStaticHeaders(_routeToHeaders, _config);
            const fileSystemRouteIndex = normalized.routes.findIndex(
              (r) => "handle" in r && r.handle === "filesystem"
            );
            normalized.routes.splice(fileSystemRouteIndex, 0, ...routesWithConfigHeaders);
          }
        }
        await writeJson(vercelConfigJson, {
          version: 3,
          routes: normalized.routes,
          images
        });
        if (_buildOutput === "server") {
          await removeDir(_buildTempFolder);
        }
      }
    }
  };
}
function isAcceptedPattern(pattern) {
  if (pattern == null) {
    return false;
  }
  if (!pattern.hostname) {
    return false;
  }
  if (pattern.protocol && (pattern.protocol !== "http" || pattern.protocol !== "https")) {
    return false;
  }
  return true;
}
class VercelBuilder {
  constructor(config, excludeFiles, includeFiles, logger, outDir, maxDuration, runtime = getRuntime(process, logger)) {
    this.config = config;
    this.excludeFiles = excludeFiles;
    this.includeFiles = includeFiles;
    this.logger = logger;
    this.outDir = outDir;
    this.maxDuration = maxDuration;
    this.runtime = runtime;
  }
  NTF_CACHE = {};
  async buildServerlessFolder(entry, functionName, root) {
    const { includeFiles, excludeFiles, logger, NTF_CACHE, runtime, maxDuration } = this;
    const functionFolder = new URL(`./functions/${functionName}.func/`, this.outDir);
    const packageJson = new URL(`./functions/${functionName}.func/package.json`, this.outDir);
    const vcConfig = new URL(`./functions/${functionName}.func/.vc-config.json`, this.outDir);
    const { handler } = await copyDependenciesToFunction(
      {
        entry,
        outDir: functionFolder,
        includeFiles,
        excludeFiles,
        logger,
        root
      },
      NTF_CACHE
    );
    await writeJson(packageJson, {
      type: "module"
    });
    await writeJson(vcConfig, {
      runtime,
      handler: handler.replaceAll("\\", "/"),
      launcherType: "Nodejs",
      maxDuration,
      supportsResponseStreaming: true
    });
  }
  async buildISRFolder(entry, functionName, isr, root) {
    await this.buildServerlessFolder(entry, functionName, root);
    const prerenderConfig = new URL(
      `./functions/${functionName}.prerender-config.json`,
      this.outDir
    );
    await writeJson(prerenderConfig, {
      expiration: isr.expiration ?? false,
      bypassToken: isr.bypassToken,
      allowQuery: [ASTRO_PATH_PARAM],
      passQuery: true
    });
  }
  async buildMiddlewareFolder(entry, functionName, middlewareSecret) {
    const functionFolder = new URL(`./functions/${functionName}.func/`, this.outDir);
    await generateEdgeMiddleware(
      entry,
      this.config.root,
      new URL(VERCEL_EDGE_MIDDLEWARE_FILE, this.config.srcDir),
      new URL("./middleware.mjs", functionFolder),
      middlewareSecret,
      this.logger
    );
    await writeJson(new URL(`./.vc-config.json`, functionFolder), {
      runtime: "edge",
      entrypoint: "middleware.mjs"
    });
  }
}
function getRuntime(process2, logger) {
  const version = process2.version.slice(1);
  const major = version.split(".")[0];
  const support = SUPPORTED_NODE_VERSIONS[major];
  if (support === void 0) {
    logger.warn(
      `
	The local Node.js version (${major}) is not supported by Vercel Serverless Functions.
	Your project will use Node.js 22 as the runtime instead.
	Consider switching your local version to 22.
`
    );
    return "nodejs22.x";
  }
  if (support.status === "default" || support.status === "available") {
    return `nodejs${major}.x`;
  }
  if (support.status === "retiring") {
    if (support.warnDate && /* @__PURE__ */ new Date() >= support.warnDate) {
      logger.warn(
        `Your project is being built for Node.js ${major} as the runtime, which is retiring by ${support.removal}.`
      );
    }
    return `nodejs${major}.x`;
  }
  if (support.status === "beta") {
    logger.warn(
      `Your project is being built for Node.js ${major} as the runtime, which is currently in beta for Vercel Serverless Functions.`
    );
    return `nodejs${major}.x`;
  }
  if (support.status === "deprecated") {
    logger.warn(
      `
	Your project is being built for Node.js ${major} as the runtime.
	This version is deprecated by Vercel Serverless Functions.
	Consider upgrading your local version to 22.
`
    );
    return `nodejs${major}.x`;
  }
  return "nodejs22.x";
}
function createRoutesWithStaticHeaders(staticHeaders, config) {
  const vercelHeaders = [];
  for (const [pathname, { headers }] of staticHeaders.entries()) {
    if (config.experimental.csp) {
      const csp = headers.get("Content-Security-Policy");
      if (csp) {
        const _headers = {
          "content-security-policy": csp
        };
        vercelHeaders.push({
          src: pathname,
          headers: _headers
        });
      }
    }
  }
  return vercelHeaders;
}

export { ASTRO_LOCALS_HEADER as A, ASTRO_MIDDLEWARE_SECRET_HEADER as a, ASTRO_PATH_HEADER as b, ASTRO_PATH_PARAM as c, vercelAdapter as v };
