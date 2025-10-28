import { p as cspAlgorithmSchema, q as cspHashSchema, v as allowedDirectivesSchema, w as ASTRO_VERSION, A as AstroError, x as UnknownContentCollectionError, e as createComponent, f as createAstro, n as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BAyaMtYH.mjs';
import { $ as $$MainLayout } from '../chunks/mainLayout_BEyIlhAL.mjs';
/* empty css                                                  */
import { version } from 'vite';
import 'common-ancestor-path';
import { syntaxHighlightDefaults, markdownConfigDefaults } from '@astrojs/markdown-remark';
import { bundledThemes } from 'shiki';
import { z } from 'zod';
import { createRequire } from 'node:module';
import 'clsx';
import 'es-module-lexer';
import '../chunks/astro-designed-error-pages_BryYo11E.mjs';
import 'xxhash-wasm';
import 'github-slugger';
import '../chunks/index_aYWP_-NP.mjs';
import 'esbuild';
import { AstroTelemetry } from '@astrojs/telemetry';
import colors from 'picocolors';
import 'html-escaper';
import debugPackage from 'debug';
import 'js-yaml';
import 'smol-toml';
import 'tsconfck';
import 'zod-to-json-schema';
import '@rollup/pluginutils';
import 'dlv';
import 'dset';
import 'cookie';
import 'prompts';
import '@astrojs/compiler';
import react from '@vitejs/plugin-react';
import { version as version$1 } from 'react-dom';
import { v as vercelAdapter } from '../chunks/index_BVDK8UJ3.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { B as Button } from '../chunks/button_DHK_v4Xg.mjs';
export { renderers } from '../renderers.mjs';

const LOCAL_PROVIDER_NAME = "local";

const weightSchema = z.union([z.string(), z.number()]);
const styleSchema = z.enum(["normal", "italic", "oblique"]);
const unicodeRangeSchema = z.array(z.string()).nonempty();
const familyPropertiesSchema = z.object({
  /**
   * A [font weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight). If the associated font is a [variable font](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide), you can specify a range of weights:
   *
   * ```js
   * weight: "100 900"
   * ```
   */
  weight: weightSchema.optional(),
  /**
   * A [font style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style).
   */
  style: styleSchema.optional(),
  /**
   * @default `"swap"`
   *
   * A [font display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display).
   */
  display: z.enum(["auto", "block", "swap", "fallback", "optional"]).optional(),
  /**
   * A [font stretch](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-stretch).
   */
  stretch: z.string().optional(),
  /**
   * Font [feature settings](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-feature-settings).
   */
  featureSettings: z.string().optional(),
  /**
   * Font [variation settings](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variation-settings).
   */
  variationSettings: z.string().optional()
});
const fallbacksSchema = z.object({
  /**
  	 * @default `["sans-serif"]`
  	 *
  	 * An array of fonts to use when your chosen font is unavailable, or loading. Fallback fonts will be chosen in the order listed. The first available font will be used:
  	 *
  	 * ```js
  	 * fallbacks: ["CustomFont", "serif"]
  	 * ```
  	 *
  	 * To disable fallback fonts completely, configure an empty array:
  	 *
  	 * ```js
  	 * fallbacks: []
  	 * ```
  	 *
  
  	 * If the last font in the `fallbacks` array is a [generic family name](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name), Astro will attempt to generate [optimized fallbacks](https://developer.chrome.com/blog/font-fallbacks) using font metrics will be generated. To disable this optimization, set `optimizedFallbacks` to false.
  	 */
  fallbacks: z.array(z.string()).optional(),
  /**
   * @default `true`
   *
   * Whether or not to enable optimized fallback generation. You may disable this default optimization to have full control over `fallbacks`.
   */
  optimizedFallbacks: z.boolean().optional()
});
const requiredFamilyAttributesSchema = z.object({
  /**
   * The font family name, as identified by your font provider.
   */
  name: z.string(),
  /**
   * A valid [ident](https://developer.mozilla.org/en-US/docs/Web/CSS/ident) in the form of a CSS variable (i.e. starting with `--`).
   */
  cssVariable: z.string()
});
const entrypointSchema = z.union([z.string(), z.instanceof(URL)]);
const fontProviderSchema = z.object({
  /**
   * URL, path relative to the root or package import.
   */
  entrypoint: entrypointSchema,
  /**
   * Optional serializable object passed to the unifont provider.
   */
  config: z.record(z.string(), z.any()).optional()
}).strict();
const localFontFamilySchema = requiredFamilyAttributesSchema.merge(fallbacksSchema).merge(
  z.object({
    /**
     * The source of your font files. Set to `"local"` to use local font files.
     */
    provider: z.literal(LOCAL_PROVIDER_NAME),
    /**
     * Each variant represents a [`@font-face` declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/).
     */
    variants: z.array(
      familyPropertiesSchema.merge(
        z.object({
          /**
           * Font [sources](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src). It can be a path relative to the root, a package import or a URL. URLs are particularly useful if you inject local fonts through an integration.
           */
          src: z.array(
            z.union([
              entrypointSchema,
              z.object({ url: entrypointSchema, tech: z.string().optional() }).strict()
            ])
          ).nonempty(),
          /**
           * A [unicode range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range).
           */
          unicodeRange: unicodeRangeSchema.optional()
          // TODO: find a way to support subsets (through fontkit?)
        }).strict()
      )
    ).nonempty()
  })
).strict();
const remoteFontFamilySchema = requiredFamilyAttributesSchema.merge(
  familyPropertiesSchema.omit({
    weight: true,
    style: true
  })
).merge(fallbacksSchema).merge(
  z.object({
    /**
     * The source of your font files. You can use a built-in provider or write your own custom provider.
     */
    provider: fontProviderSchema,
    /**
     * @default `[400]`
     *
     * An array of [font weights](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight). If the associated font is a [variable font](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide), you can specify a range of weights:
     *
     * ```js
     * weight: "100 900"
     * ```
     */
    weights: z.array(weightSchema).nonempty().optional(),
    /**
     * @default `["normal", "italic"]`
     *
     * An array of [font styles](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style).
     */
    styles: z.array(styleSchema).nonempty().optional(),
    /**
     * @default `["cyrillic-ext", "cyrillic", "greek-ext", "greek", "vietnamese", "latin-ext", "latin"]`
     *
     * An array of [font subsets](https://knaap.dev/posts/font-subsetting/):
     */
    subsets: z.array(z.string()).nonempty().optional(),
    /**
     * A [unicode range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range).
     */
    unicodeRange: unicodeRangeSchema.optional()
  })
).strict();

const StringSchema = z.object({
  type: z.literal("string"),
  optional: z.boolean().optional(),
  default: z.string().optional(),
  max: z.number().optional(),
  min: z.number().min(0).optional(),
  length: z.number().optional(),
  url: z.boolean().optional(),
  includes: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional()
});
const NumberSchema = z.object({
  type: z.literal("number"),
  optional: z.boolean().optional(),
  default: z.number().optional(),
  gt: z.number().optional(),
  min: z.number().optional(),
  lt: z.number().optional(),
  max: z.number().optional(),
  int: z.boolean().optional()
});
const BooleanSchema = z.object({
  type: z.literal("boolean"),
  optional: z.boolean().optional(),
  default: z.boolean().optional()
});
const EnumSchema = z.object({
  type: z.literal("enum"),
  values: z.array(
    // We use "'" for codegen so it can't be passed here
    z.string().refine((v) => !v.includes("'"), {
      message: `The "'" character can't be used as an enum value`
    })
  ),
  optional: z.boolean().optional(),
  default: z.string().optional()
});
const EnvFieldType = z.union([
  StringSchema,
  NumberSchema,
  BooleanSchema,
  EnumSchema.superRefine((schema, ctx) => {
    if (schema.default) {
      if (!schema.values.includes(schema.default)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `The default value "${schema.default}" must be one of the specified values: ${schema.values.join(", ")}.`
        });
      }
    }
  })
]);
const PublicClientEnvFieldMetadata = z.object({
  context: z.literal("client"),
  access: z.literal("public")
});
const PublicServerEnvFieldMetadata = z.object({
  context: z.literal("server"),
  access: z.literal("public")
});
const SecretServerEnvFieldMetadata = z.object({
  context: z.literal("server"),
  access: z.literal("secret")
});
const _EnvFieldMetadata = z.union([
  PublicClientEnvFieldMetadata,
  PublicServerEnvFieldMetadata,
  SecretServerEnvFieldMetadata
]);
const EnvFieldMetadata = z.custom().superRefine((data, ctx) => {
  const result = _EnvFieldMetadata.safeParse(data);
  if (result.success) {
    return;
  }
  for (const issue of result.error.issues) {
    if (issue.code === z.ZodIssueCode.invalid_union) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `**Invalid combination** of "access" and "context" options:
  Secret client variables are not supported. Please review the configuration of \`env.schema.${ctx.path.at(-1)}\`.
  Learn more at https://docs.astro.build/en/guides/environment-variables/#variable-types`,
        path: ["context", "access"]
      });
    } else {
      ctx.addIssue(issue);
    }
  }
});
const EnvSchemaKey = z.string().min(1).refine(([firstChar]) => isNaN(Number.parseInt(firstChar)), {
  message: "A valid variable name cannot start with a number."
}).refine((str) => /^[A-Z0-9_]+$/.test(str), {
  message: "A valid variable name can only contain uppercase letters, numbers and underscores."
});
const EnvSchema = z.record(EnvSchemaKey, z.intersection(EnvFieldMetadata, EnvFieldType));

const ASTRO_CONFIG_DEFAULTS = {
  root: ".",
  srcDir: "./src",
  publicDir: "./public",
  outDir: "./dist",
  cacheDir: "./node_modules/.astro",
  base: "/",
  trailingSlash: "ignore",
  build: {
    format: "directory",
    client: "./client/",
    server: "./server/",
    assets: "_astro",
    serverEntry: "entry.mjs",
    redirects: true,
    inlineStylesheets: "auto",
    concurrency: 1
  },
  image: {
    endpoint: { entrypoint: void 0, route: "/_image" },
    service: { entrypoint: "astro/assets/services/sharp", config: {} },
    responsiveStyles: false
  },
  devToolbar: {
    enabled: true
  },
  compressHTML: true,
  server: {
    host: false,
    port: 4321,
    open: false,
    allowedHosts: []
  },
  integrations: [],
  markdown: markdownConfigDefaults,
  vite: {},
  legacy: {
    collections: false
  },
  redirects: {},
  security: {
    checkOrigin: true,
    allowedDomains: []
  },
  env: {
    schema: {},
    validateSecrets: false
  },
  experimental: {
    clientPrerender: false,
    contentIntellisense: false,
    headingIdCompat: false,
    preserveScriptOrder: false,
    liveContentCollections: false,
    csp: false,
    staticImportMetaEnv: false,
    chromeDevtoolsWorkspace: false,
    failOnPrerenderConflict: false
  }
};
const highlighterTypesSchema = z.union([z.literal("shiki"), z.literal("prism")]).default(syntaxHighlightDefaults.type);
z.object({
  root: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.root).transform((val) => new URL(val)),
  srcDir: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.srcDir).transform((val) => new URL(val)),
  publicDir: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.publicDir).transform((val) => new URL(val)),
  outDir: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.outDir).transform((val) => new URL(val)),
  cacheDir: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.cacheDir).transform((val) => new URL(val)),
  site: z.string().url().optional(),
  compressHTML: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.compressHTML),
  base: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.base),
  trailingSlash: z.union([z.literal("always"), z.literal("never"), z.literal("ignore")]).optional().default(ASTRO_CONFIG_DEFAULTS.trailingSlash),
  output: z.union([z.literal("static"), z.literal("server")]).optional().default("static"),
  scopedStyleStrategy: z.union([z.literal("where"), z.literal("class"), z.literal("attribute")]).optional().default("attribute"),
  adapter: z.object({ name: z.string(), hooks: z.object({}).passthrough().default({}) }).optional(),
  integrations: z.preprocess(
    // preprocess
    (val) => Array.isArray(val) ? val.flat(Infinity).filter(Boolean) : val,
    // validate
    z.array(z.object({ name: z.string(), hooks: z.object({}).passthrough().default({}) })).default(ASTRO_CONFIG_DEFAULTS.integrations)
  ),
  build: z.object({
    format: z.union([z.literal("file"), z.literal("directory"), z.literal("preserve")]).optional().default(ASTRO_CONFIG_DEFAULTS.build.format),
    client: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.build.client).transform((val) => new URL(val)),
    server: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.build.server).transform((val) => new URL(val)),
    assets: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.build.assets),
    assetsPrefix: z.string().optional().or(z.object({ fallback: z.string() }).and(z.record(z.string())).optional()),
    serverEntry: z.string().optional().default(ASTRO_CONFIG_DEFAULTS.build.serverEntry),
    redirects: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.build.redirects),
    inlineStylesheets: z.enum(["always", "auto", "never"]).optional().default(ASTRO_CONFIG_DEFAULTS.build.inlineStylesheets),
    concurrency: z.number().min(1).optional().default(ASTRO_CONFIG_DEFAULTS.build.concurrency)
  }).default({}),
  server: z.preprocess(
    // preprocess
    // NOTE: Uses the "error" command here because this is overwritten by the
    // individualized schema parser with the correct command.
    (val) => typeof val === "function" ? val({ command: "error" }) : val,
    // validate
    z.object({
      open: z.union([z.string(), z.boolean()]).optional().default(ASTRO_CONFIG_DEFAULTS.server.open),
      host: z.union([z.string(), z.boolean()]).optional().default(ASTRO_CONFIG_DEFAULTS.server.host),
      port: z.number().optional().default(ASTRO_CONFIG_DEFAULTS.server.port),
      headers: z.custom().optional(),
      allowedHosts: z.union([z.array(z.string()), z.literal(true)]).optional().default(ASTRO_CONFIG_DEFAULTS.server.allowedHosts)
    }).default({})
  ),
  redirects: z.record(
    z.string(),
    z.union([
      z.string(),
      z.object({
        status: z.union([
          z.literal(300),
          z.literal(301),
          z.literal(302),
          z.literal(303),
          z.literal(304),
          z.literal(307),
          z.literal(308)
        ]),
        destination: z.string()
      })
    ])
  ).default(ASTRO_CONFIG_DEFAULTS.redirects),
  prefetch: z.union([
    z.boolean(),
    z.object({
      prefetchAll: z.boolean().optional(),
      defaultStrategy: z.enum(["tap", "hover", "viewport", "load"]).optional()
    })
  ]).optional(),
  image: z.object({
    endpoint: z.object({
      route: z.literal("/_image").or(z.string()).default(ASTRO_CONFIG_DEFAULTS.image.endpoint.route),
      entrypoint: z.string().optional()
    }).default(ASTRO_CONFIG_DEFAULTS.image.endpoint),
    service: z.object({
      entrypoint: z.union([z.literal("astro/assets/services/sharp"), z.string()]).default(ASTRO_CONFIG_DEFAULTS.image.service.entrypoint),
      config: z.record(z.any()).default({})
    }).default(ASTRO_CONFIG_DEFAULTS.image.service),
    domains: z.array(z.string()).default([]),
    remotePatterns: z.array(
      z.object({
        protocol: z.string().optional(),
        hostname: z.string().optional(),
        port: z.string().optional(),
        pathname: z.string().optional()
      })
    ).default([]),
    layout: z.enum(["constrained", "fixed", "full-width", "none"]).optional(),
    objectFit: z.string().optional(),
    objectPosition: z.string().optional(),
    breakpoints: z.array(z.number()).optional(),
    responsiveStyles: z.boolean().default(ASTRO_CONFIG_DEFAULTS.image.responsiveStyles)
  }).default(ASTRO_CONFIG_DEFAULTS.image),
  devToolbar: z.object({
    enabled: z.boolean().default(ASTRO_CONFIG_DEFAULTS.devToolbar.enabled)
  }).default(ASTRO_CONFIG_DEFAULTS.devToolbar),
  markdown: z.object({
    syntaxHighlight: z.union([
      z.object({
        type: highlighterTypesSchema,
        excludeLangs: z.array(z.string()).optional().default(syntaxHighlightDefaults.excludeLangs)
      }).default(syntaxHighlightDefaults),
      highlighterTypesSchema,
      z.literal(false)
    ]).default(ASTRO_CONFIG_DEFAULTS.markdown.syntaxHighlight),
    shikiConfig: z.object({
      langs: z.custom().array().transform((langs) => {
        for (const lang of langs) {
          if (typeof lang === "object") {
            if (lang.id) {
              lang.name = lang.id;
            }
            if (lang.grammar) {
              Object.assign(lang, lang.grammar);
            }
          }
        }
        return langs;
      }).default([]),
      langAlias: z.record(z.string(), z.string()).optional().default(ASTRO_CONFIG_DEFAULTS.markdown.shikiConfig.langAlias),
      theme: z.enum(Object.keys(bundledThemes)).or(z.custom()).default(ASTRO_CONFIG_DEFAULTS.markdown.shikiConfig.theme),
      themes: z.record(
        z.enum(Object.keys(bundledThemes)).or(z.custom())
      ).default(ASTRO_CONFIG_DEFAULTS.markdown.shikiConfig.themes),
      defaultColor: z.union([z.literal("light"), z.literal("dark"), z.string(), z.literal(false)]).optional(),
      wrap: z.boolean().or(z.null()).default(ASTRO_CONFIG_DEFAULTS.markdown.shikiConfig.wrap),
      transformers: z.custom().array().default(ASTRO_CONFIG_DEFAULTS.markdown.shikiConfig.transformers)
    }).default({}),
    remarkPlugins: z.union([
      z.string(),
      z.tuple([z.string(), z.any()]),
      z.custom((data) => typeof data === "function"),
      z.tuple([z.custom((data) => typeof data === "function"), z.any()])
    ]).array().default(ASTRO_CONFIG_DEFAULTS.markdown.remarkPlugins),
    rehypePlugins: z.union([
      z.string(),
      z.tuple([z.string(), z.any()]),
      z.custom((data) => typeof data === "function"),
      z.tuple([z.custom((data) => typeof data === "function"), z.any()])
    ]).array().default(ASTRO_CONFIG_DEFAULTS.markdown.rehypePlugins),
    remarkRehype: z.custom((data) => data instanceof Object && !Array.isArray(data)).default(ASTRO_CONFIG_DEFAULTS.markdown.remarkRehype),
    gfm: z.boolean().default(ASTRO_CONFIG_DEFAULTS.markdown.gfm),
    smartypants: z.boolean().default(ASTRO_CONFIG_DEFAULTS.markdown.smartypants)
  }).default({}),
  vite: z.custom((data) => data instanceof Object && !Array.isArray(data)).default(ASTRO_CONFIG_DEFAULTS.vite),
  i18n: z.optional(
    z.object({
      defaultLocale: z.string(),
      locales: z.array(
        z.union([
          z.string(),
          z.object({
            path: z.string(),
            codes: z.string().array().nonempty()
          })
        ])
      ),
      domains: z.record(
        z.string(),
        z.string().url(
          "The domain value must be a valid URL, and it has to start with 'https' or 'http'."
        )
      ).optional(),
      fallback: z.record(z.string(), z.string()).optional(),
      routing: z.literal("manual").or(
        z.object({
          prefixDefaultLocale: z.boolean().optional().default(false),
          // TODO: Astro 6.0 change to false
          redirectToDefaultLocale: z.boolean().optional().default(true),
          fallbackType: z.enum(["redirect", "rewrite"]).optional().default("redirect")
        })
      ).optional().default({})
    }).optional()
  ),
  security: z.object({
    checkOrigin: z.boolean().default(ASTRO_CONFIG_DEFAULTS.security.checkOrigin),
    allowedDomains: z.array(
      z.object({
        hostname: z.string().optional(),
        protocol: z.string().optional(),
        port: z.string().optional()
      })
    ).optional().default(ASTRO_CONFIG_DEFAULTS.security.allowedDomains)
  }).optional().default(ASTRO_CONFIG_DEFAULTS.security),
  env: z.object({
    schema: EnvSchema.optional().default(ASTRO_CONFIG_DEFAULTS.env.schema),
    validateSecrets: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.env.validateSecrets)
  }).strict().optional().default(ASTRO_CONFIG_DEFAULTS.env),
  session: z.object({
    driver: z.string().optional(),
    options: z.record(z.any()).optional(),
    cookie: z.object({
      name: z.string().optional(),
      domain: z.string().optional(),
      path: z.string().optional(),
      maxAge: z.number().optional(),
      sameSite: z.union([z.enum(["strict", "lax", "none"]), z.boolean()]).optional(),
      secure: z.boolean().optional()
    }).or(z.string()).transform((val) => {
      if (typeof val === "string") {
        return { name: val };
      }
      return val;
    }).optional(),
    ttl: z.number().optional()
  }).optional(),
  experimental: z.object({
    clientPrerender: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.clientPrerender),
    contentIntellisense: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.contentIntellisense),
    headingIdCompat: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.headingIdCompat),
    preserveScriptOrder: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.preserveScriptOrder),
    fonts: z.array(z.union([localFontFamilySchema, remoteFontFamilySchema])).optional(),
    liveContentCollections: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.liveContentCollections),
    csp: z.union([
      z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.csp),
      z.object({
        algorithm: cspAlgorithmSchema,
        directives: z.array(allowedDirectivesSchema).optional(),
        styleDirective: z.object({
          resources: z.array(z.string()).optional(),
          hashes: z.array(cspHashSchema).optional()
        }).optional(),
        scriptDirective: z.object({
          resources: z.array(z.string()).optional(),
          hashes: z.array(cspHashSchema).optional(),
          strictDynamic: z.boolean().optional()
        }).optional()
      })
    ]).optional().default(ASTRO_CONFIG_DEFAULTS.experimental.csp),
    staticImportMetaEnv: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.staticImportMetaEnv),
    chromeDevtoolsWorkspace: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.chromeDevtoolsWorkspace),
    failOnPrerenderConflict: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.experimental.failOnPrerenderConflict)
  }).strict(
    `Invalid or outdated experimental feature.
Check for incorrect spelling or outdated Astro version.
See https://docs.astro.build/en/reference/experimental-flags/ for a list of all current experiments.`
  ).default({}),
  legacy: z.object({
    collections: z.boolean().optional().default(ASTRO_CONFIG_DEFAULTS.legacy.collections)
  }).default({})
});

z.custom().superRefine((config, ctx) => {
  if (config.build.assetsPrefix && typeof config.build.assetsPrefix !== "string" && !config.build.assetsPrefix.fallback) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The `fallback` is mandatory when defining the option as an object.",
      path: ["build", "assetsPrefix"]
    });
  }
  for (let i = 0; i < config.image.remotePatterns.length; i++) {
    const { hostname, pathname } = config.image.remotePatterns[i];
    if (hostname && hostname.includes("*") && !(hostname.startsWith("*.") || hostname.startsWith("**."))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "wildcards can only be placed at the beginning of the hostname",
        path: ["image", "remotePatterns", i, "hostname"]
      });
    }
    if (pathname && pathname.includes("*") && !(pathname.endsWith("/*") || pathname.endsWith("/**"))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "wildcards can only be placed at the end of a pathname",
        path: ["image", "remotePatterns", i, "pathname"]
      });
    }
  }
  if (config.outDir.toString().startsWith(config.publicDir.toString())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The value of `outDir` must not point to a path within the folder set as `publicDir`, this will cause an infinite loop",
      path: ["outDir"]
    });
  }
  if (config.i18n) {
    const { defaultLocale, locales: _locales, fallback, domains } = config.i18n;
    const locales = _locales.map((locale) => {
      if (typeof locale === "string") {
        return locale;
      } else {
        return locale.path;
      }
    });
    if (!locales.includes(defaultLocale)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The default locale \`${defaultLocale}\` is not present in the \`i18n.locales\` array.`,
        path: ["i18n", "locales"]
      });
    }
    if (fallback) {
      for (const [fallbackFrom, fallbackTo] of Object.entries(fallback)) {
        if (!locales.includes(fallbackFrom)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The locale \`${fallbackFrom}\` key in the \`i18n.fallback\` record doesn't exist in the \`i18n.locales\` array.`,
            path: ["i18n", "fallbacks"]
          });
        }
        if (fallbackFrom === defaultLocale) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `You can't use the default locale as a key. The default locale can only be used as value.`,
            path: ["i18n", "fallbacks"]
          });
        }
        if (!locales.includes(fallbackTo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The locale \`${fallbackTo}\` value in the \`i18n.fallback\` record doesn't exist in the \`i18n.locales\` array.`,
            path: ["i18n", "fallbacks"]
          });
        }
      }
    }
    if (domains) {
      const entries = Object.entries(domains);
      const hasDomains = domains ? Object.keys(domains).length > 0 : false;
      if (entries.length > 0 && !hasDomains) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `When specifying some domains, the property \`i18n.routing.strategy\` must be set to \`"domains"\`.`,
          path: ["i18n", "routing", "strategy"]
        });
      }
      if (hasDomains) {
        if (!config.site) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The option `site` isn't set. When using the 'domains' strategy for `i18n`, `site` is required to create absolute URLs for locales that aren't mapped to a domain.",
            path: ["site"]
          });
        }
        if (config.output !== "server") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Domain support is only available when `output` is `"server"`.',
            path: ["output"]
          });
        }
      }
      for (const [domainKey, domainValue] of entries) {
        if (!locales.includes(domainKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The locale \`${domainKey}\` key in the \`i18n.domains\` record doesn't exist in the \`i18n.locales\` array.`,
            path: ["i18n", "domains"]
          });
        }
        if (!domainValue.startsWith("https") && !domainValue.startsWith("http")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The domain value must be a valid URL, and it has to start with 'https' or 'http'.",
            path: ["i18n", "domains"]
          });
        } else {
          try {
            const domainUrl = new URL(domainValue);
            if (domainUrl.pathname !== "/") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `The URL \`${domainValue}\` must contain only the origin. A subsequent pathname isn't allowed here. Remove \`${domainUrl.pathname}\`.`,
                path: ["i18n", "domains"]
              });
            }
          } catch {
          }
        }
      }
    }
  }
  if (config.experimental.fonts && config.experimental.fonts.length > 0) {
    for (let i = 0; i < config.experimental.fonts.length; i++) {
      const { cssVariable } = config.experimental.fonts[i];
      if (!cssVariable.startsWith("--") || cssVariable.includes(" ") || cssVariable.includes(":")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `**cssVariable** property "${cssVariable}" contains invalid characters for CSS variable generation. It must start with -- and be a valid indent: https://developer.mozilla.org/en-US/docs/Web/CSS/ident.`,
          path: ["fonts", i, "cssVariable"]
        });
      }
    }
  }
});

const CONTENT_LAYER_TYPE = "content_layer";
const LIVE_CONTENT_TYPE = "live";

typeof process !== "undefined" && process.platform === "win32";

const entryTypeSchema = z.object({
  id: z.string({
    invalid_type_error: "Content entry `id` must be a string"
    // Default to empty string so we can validate properly in the loader
  })
}).passthrough();
z.union([
  z.array(entryTypeSchema),
  z.record(
    z.string(),
    z.object({
      id: z.string({
        invalid_type_error: "Content entry `id` must be a string"
      }).optional()
    }).passthrough()
  )
]);
const collectionConfigParser = z.union([
  z.object({
    type: z.literal("content").optional().default("content"),
    schema: z.any().optional()
  }),
  z.object({
    type: z.literal("data"),
    schema: z.any().optional()
  }),
  z.object({
    type: z.literal(CONTENT_LAYER_TYPE),
    schema: z.any().optional(),
    loader: z.union([
      z.function(),
      z.object({
        name: z.string(),
        load: z.function(
          z.tuple(
            [
              z.object({
                collection: z.string(),
                store: z.any(),
                meta: z.any(),
                logger: z.any(),
                config: z.any(),
                entryTypes: z.any(),
                parseData: z.any(),
                renderMarkdown: z.any(),
                generateDigest: z.function(z.tuple([z.any()], z.string())),
                watcher: z.any().optional(),
                refreshContextData: z.record(z.unknown()).optional()
              })
            ],
            z.unknown()
          )
        ),
        schema: z.any().optional(),
        render: z.function(z.tuple([z.any()], z.unknown())).optional()
      })
    ]),
    /** deprecated */
    _legacy: z.boolean().optional()
  }),
  z.object({
    type: z.literal(LIVE_CONTENT_TYPE).optional().default(LIVE_CONTENT_TYPE),
    schema: z.any().optional(),
    loader: z.function()
  })
]);
z.object({
  collections: z.record(collectionConfigParser)
});

new AstroTelemetry({
  astroVersion: ASTRO_VERSION,
  viteVersion: version
});

const {
  bgGreen,
  bgYellow,
  bgCyan,
  bgWhite,
  black,
  blue,
  bold,
  cyan,
  dim,
  green,
  red,
  underline,
  yellow
} = colors;

const debuggers = {};
function debug(type, ...messages) {
  const namespace = `astro:${type}`;
  debuggers[namespace] = debuggers[namespace] || debugPackage(namespace);
  return debuggers[namespace](...messages);
}
globalThis._astroGlobalDebug = debug;

new AstroError({
  ...UnknownContentCollectionError,
  message: `Unexpected error while parsing content entry IDs and slugs.`
});

createRequire(import.meta.url);

function defineConfig$1(config) {
  return config;
}

function getReactMajorVersion() {
  const matches = /\d+\./.exec(version$1);
  if (!matches) {
    return NaN;
  }
  return Number(matches[0]);
}
function isUnsupportedVersion(majorVersion) {
  return majorVersion < 17 || majorVersion > 19 || Number.isNaN(majorVersion);
}
const versionsConfig = {
  17: {
    server: "@astrojs/react/server-v17.js",
    client: "@astrojs/react/client-v17.js"
  },
  18: {
    server: "@astrojs/react/server.js",
    client: "@astrojs/react/client.js"
  },
  19: {
    server: "@astrojs/react/server.js",
    client: "@astrojs/react/client.js"
  }
};

const FAST_REFRESH_PREAMBLE = react.preambleCode;
function getRenderer(reactConfig) {
  return {
    name: "@astrojs/react",
    clientEntrypoint: reactConfig.client,
    serverEntrypoint: reactConfig.server
  };
}
function optionsPlugin({
  experimentalReactChildren = false,
  experimentalDisableStreaming = false
}) {
  const virtualModule = "astro:react:opts";
  const virtualModuleId = "\0" + virtualModule;
  return {
    name: "@astrojs/react:opts",
    resolveId(id) {
      if (id === virtualModule) {
        return virtualModuleId;
      }
    },
    load(id) {
      if (id === virtualModuleId) {
        return {
          code: `export default {
						experimentalReactChildren: ${JSON.stringify(experimentalReactChildren)},
						experimentalDisableStreaming: ${JSON.stringify(experimentalDisableStreaming)}
					}`
        };
      }
    }
  };
}
function getViteConfiguration({
  include,
  exclude,
  babel,
  experimentalReactChildren,
  experimentalDisableStreaming
} = {}, reactConfig) {
  return {
    optimizeDeps: {
      include: [reactConfig.client],
      exclude: [reactConfig.server]
    },
    plugins: [
      react({ include, exclude, babel }),
      optionsPlugin({
        experimentalReactChildren: !!experimentalReactChildren,
        experimentalDisableStreaming: !!experimentalDisableStreaming
      })
    ],
    ssr: {
      noExternal: [
        // These are all needed to get mui to work.
        "@mui/material",
        "@mui/base",
        "@babel/runtime",
        "use-immer",
        "@material-tailwind/react"
      ]
    }
  };
}
function index_default({
  include,
  exclude,
  babel,
  experimentalReactChildren,
  experimentalDisableStreaming
} = {}) {
  const majorVersion = getReactMajorVersion();
  if (isUnsupportedVersion(majorVersion)) {
    throw new Error(`Unsupported React version: ${majorVersion}.`);
  }
  const versionConfig = versionsConfig[majorVersion];
  return {
    name: "@astrojs/react",
    hooks: {
      "astro:config:setup": ({ command, addRenderer, updateConfig, injectScript }) => {
        addRenderer(getRenderer(versionConfig));
        updateConfig({
          vite: getViteConfiguration(
            { include, exclude, babel, experimentalReactChildren, experimentalDisableStreaming },
            versionConfig
          )
        });
        if (command === "dev") {
          const preamble = FAST_REFRESH_PREAMBLE.replace(`__BASE__`, "/");
          injectScript("before-hydration", preamble);
        }
      },
      "astro:config:done": ({ logger, config }) => {
        const knownJsxRenderers = ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js"];
        const enabledKnownJsxRenderers = config.integrations.filter(
          (renderer) => knownJsxRenderers.includes(renderer.name)
        );
        if (enabledKnownJsxRenderers.length > 1 && !include && !exclude) {
          logger.warn(
            "More than one JSX renderer is enabled. This will lead to unexpected behavior unless you set the `include` or `exclude` option. See https://docs.astro.build/en/guides/integrations-guide/react/#combining-multiple-jsx-frameworks for more information."
          );
        }
      }
    }
  };
}

// @ts-check


const base = ''; // make this the directory where all the pages go


// https://astro.build/config
const defineConfig = defineConfig$1({
  output: 'server',
  adapter: vercelAdapter({
    webAnalytics: {
      enabled: false
    }
  }),
  base: base, //where the project is deployed
  vite: {
    css: {
      postcss: './postcss.config.js',
    },
  },

  integrations: [index_default()],
});

function ProjectCard({ title, description, href, buttonText }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-green-900 p-6 rounded-lg shadow-md", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: description }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
      "a",
      {
        href,
        className: "inline-block",
        children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "letu",
            className: "px-8 py-3 text-lg",
            children: buttonText
          }
        )
      }
    ) })
  ] });
}

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$MainLayout, { "title": "RK Home", "description": "Ruffles Kerman Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4"> <div class="text-center py-20"> <h1 class="text-4xl md:text-6xl font-bold text-gray-400 mb-6">
Welcome to ruffleskerman.com
</h1> <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
This is a new site, I'm working on it! Check out some of my
				projects.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center items-center"> <!-- <a href={defineConfig.base + "listen"} class="inline-block">
					<Button variant="letu" className="px-8 py-3 text-lg">Start Listening</Button>
				</a>
				<a href={defineConfig.base + "broadcast"} class="inline-block">
					<Button variant="letu" className="px-8 py-3 text-lg">Start Broadcasting</Button>
				</a> --> </div> </div> <!-- Feature cards --> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-16"> ${renderComponent($$result2, "ProjectCard", ProjectCard, { "title": "\u{1F3B2} Catan Counter", "description": "Keep track of others' cards to boost your strategy.", "href": defineConfig.base + "catancounter", "buttonText": "Catan Counter" })} ${renderComponent($$result2, "ProjectCard", ProjectCard, { "title": "\u{1F310} Need help with Wordle?", "description": "I have a bot for that...", "href": defineConfig.base + "wordlebot", "buttonText": "Wordle Bot" })} <!-- scammer project --> <!-- <ProjectCard
				title="Catch the Scammers"
				description="If you get scammed, send them to this site to 'transfer the funds'. Most probably won't fall for it but it's worth a shot."
				href={defineConfig.base + "create-account-p4A7EA1"}
				buttonText="Go"
			/> --> ${renderComponent($$result2, "ProjectCard", ProjectCard, { "title": "\u{1F6E0}\uFE0F LeTour", "description": "Listen page - Software Engineering 2 final project... In progress!", "href": defineConfig.base + "listen", "buttonText": "Listen" })} ${renderComponent($$result2, "ProjectCard", ProjectCard, { "title": "\u{1F6E0}\uFE0F LeTour", "description": "Broadcast page - Software Engineering 2 final project... In progress!", "href": defineConfig.base + "broadcast", "buttonText": "Broadcast" })} </div> </div> ` })} <!-- Original html without using the main layout --> <!-- <html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>LeTour</title>
	</head>

	<body>
		<div class="grid place-items-center h-screen content-center">
			<Button onClick={() => navigate('/listen')}>Go to Listen</Button>
			<a href="/listen" class="p-4 underline">Go to Listen</a>
		</div>
	</body>
</html> -->`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/index.astro", void 0);

const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
