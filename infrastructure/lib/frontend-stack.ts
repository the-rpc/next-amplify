import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createCodeCommitRepo } from "./utility/codecommit";
import { createAmplifyPipelineFromCodeCommitForNextJs } from "./utility/amplify";

export class FrontEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Initialize an empty AWS CodeCommit Repo to store our code and serve as the source of our Amplify App

    const codecommitRepo = createCodeCommitRepo(this, "repo-next-amplify");

    // AWS Amplify App and CI/CD Pipeline with our CodeCommit repo as the source
    // Pushes to "main" branch will rebuild and deploy app

    const pipelineBranchName = "main";

    const { amplifyApp } = createAmplifyPipelineFromCodeCommitForNextJs(
      this,
      "next-amplify",
      codecommitRepo,
      pipelineBranchName
    );

    // Get the URL that our app will be deployed to

    const amplifyAppUrl = `https://${pipelineBranchName}.${amplifyApp.defaultDomain}`;

    /* CDK Outputs */

    // Stack region

    new cdk.CfnOutput(this, `${this.stackName}Region`, {
      value: this.region,
    });

    // URLs to clone the repo

    new cdk.CfnOutput(
      this,
      `${this.stackName}CodeCommitRepositoryCloneUrlHttp`,
      {
        value: codecommitRepo.repositoryCloneUrlHttp,
      }
    );

    new cdk.CfnOutput(
      this,
      `${this.stackName}CodeCommitRepositoryCloneUrlGrc`,
      {
        value: codecommitRepo.repositoryCloneUrlGrc,
      }
    );

    // Amplify app URL

    new cdk.CfnOutput(this, `${this.stackName}AmplifyAppUrl`, {
      value: amplifyAppUrl,
    });
  }
}
