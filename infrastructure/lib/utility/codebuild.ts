import * as codebuild from "aws-cdk-lib/aws-codebuild";

/**
 * Returns the CodeBuild BuildSpec needed to install, build, and deploy a default NextJS web app
 */
export function getBuildSpecNextJs(): codebuild.BuildSpec {
  return codebuild.BuildSpec.fromObject({
    frontend: {
      phases: {
        preBuild: { commands: ["npm ci"] },
        build: { commands: ["npm run build"] },
      },
      artifacts: {
        baseDirectory: `.next`,
        files: [`**/*`],
        excludePaths: "infrastructure/*",
      },
      cache: {
        paths: [`node_modules/**/*`],
      },
    },
  });
}
