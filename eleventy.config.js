import { pathToFileURL } from "node:url";
import { evaluate } from "@mdx-js/mdx";
import { renderToStaticMarkup } from "react-dom/server";
import * as runtime from "react/jsx-runtime";

export default async function (eleventyConfig) {
    eleventyConfig.addExtension("mdx", {
        compile: async (str, inputPath) => {
            const { default: mdxContent } = await evaluate(str, {
                ...runtime,
                baseUrl: pathToFileURL(inputPath),
            });

            return async function (data) {
                let res = await mdxContent(data);
                return renderToStaticMarkup(res);
            };
        },
    });
    eleventyConfig.addTemplateFormats("mdx");

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("vids");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addFilter("niceDate", function (value) {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return value.toLocaleDateString("en-GB", options);
    });
}
