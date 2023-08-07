import { Construct } from "constructs";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import { getBuildSpecNextJs } from "./codebuild";
import * as amplifyCfn from "aws-cdk-lib/aws-amplify";

/**
 * Creates an Amplify app
 */
export function createAmplifyApp(
  scope: Construct,
  appName: string,
  amplifyAppOptions: amplify.AppProps
): amplify.App {
  const amplifyApp = new amplify.App(scope, appName, amplifyAppOptions);

  return amplifyApp;
}

/**
 * Creates an Amplify app from a CodeCommit repo
 */
export function createAmplifyAppFromCodeCommit(
  scope: Construct,
  appName: string,
  codecommitRepo: codecommit.Repository,
  amplifyAppOptions?: amplify.AppProps
): amplify.App {
  return createAmplifyApp(scope, appName, {
    ...amplifyAppOptions,
    sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
      repository: codecommitRepo,
    }),
  });
}

/**
 * Creates an Amplify Pipeline to build and deploy an app when commit are made to the specified branch name
 */
export function createAmplifyBuildPipeline(
  amplifyApp: amplify.App,
  branchName: string,
  options?: amplify.BranchOptions
) {
  return amplifyApp.addBranch(branchName, options);
}

/**
 * Creates an Amplify App and Pipeline for a Next.js App hosted in CodeCommit
 */
export function createAmplifyPipelineFromCodeCommitForNextJs(
  scope: Construct,
  appName: string,
  codecommitRepo: codecommit.Repository,
  pipelineBranchName: string,
  amplifyAppOptions?: amplify.AppProps
): { amplifyApp: amplify.App; pipelineBranch: amplify.Branch } {
  const amplifyApp = createAmplifyAppFromCodeCommit(
    scope,
    appName,
    codecommitRepo,
    {
      ...amplifyAppOptions,
      buildSpec: getBuildSpecNextJs(),
      customRules: [
        {
          source: "/<*>",
          target: "/index.html",
          status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
        },
      ],
    }
  );

  // Set Amplify App platform to support Next.js SSR
  // Use the Amplify App L1 CloudFormation Construct because setting the app platform isn't supported in the Amplify Alpha L2 App Construct

  const amplifyAppCfn = amplifyApp.node.defaultChild as amplifyCfn.CfnApp;

  amplifyAppCfn.platform = "WEB_COMPUTE";

  // Setup the CI/CD Pipeline

  const pipelineBranch = createAmplifyBuildPipeline(
    amplifyApp,
    pipelineBranchName,
    {
      stage: "PRODUCTION",
    }
  );

  // Set the Amplify Branch's framework to support Next.js SSR
  // Use the Amplify Branch L1 CloudFormation Construct because setting the branch framework isn't supported in the Amplify Alpha L2 Branch Construct

  const pipelineBranchCfn = pipelineBranch.node
    .defaultChild as amplifyCfn.CfnBranch;

  pipelineBranchCfn.framework = "Next.js - SSR";

  return { amplifyApp, pipelineBranch };
}
