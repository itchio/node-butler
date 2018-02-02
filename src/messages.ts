import {
  createRequest,
  Client,
  IRequest,
  INotification,
  createNotification,
} from "./client";
import * as itchio from "ts-itchio-api";

//---------------------------------------------------------------------
// Operate
//---------------------------------------------------------------------

export interface OperationStartParams {
  id: string;
  stagingFolder: string;
  operation: "install" | "uninstall";
  installParams?: InstallParams;
  uninstallParams?: UninstallParams;
}

export interface OperationCancelParams {
  id: string;
}

export interface OperationCancelResult {}

export interface InstallParams {
  game: itchio.Game;
  installFolder: string;
  upload?: itchio.Upload;
  build?: itchio.Build;
  credentials: GameCredentials;
}

export interface UninstallParams {
  installFolder: string;
}

export interface GameCredentials {
  server?: string;
  apiKey: string;
  downloadKey?: number;
}

export interface PickUploadParams {
  uploads: itchio.Upload[];
}

export interface PickUploadResult {
  index: number;
}

export interface GetReceiptParams {
  // muffin
}

export interface GetReceiptResult {
  receipt: Receipt;
}

export interface Receipt {
  upload: itchio.Upload;
  build?: itchio.Build;
  files: string[];
}

export interface OperationProgressNotification {
  progress: number;
  eta?: number;
  bps?: number;
}

export interface OperationResult {}

export interface InstallResult {
  game: itchio.Game;
  upload: itchio.Upload;
  build?: itchio.Build;
}

export interface GameFindUploadsParams {
  game: itchio.Game;
  credentials: GameCredentials;
}

export interface GameFindUploadsResult {
  uploads: itchio.Upload[];
}

export const Version = {
  Get: createRequest<
    {},
    {
      version: string;
      versionString: string;
    }
  >("Version.Get"),
};

export const Operation = {
  Start: createRequest<OperationStartParams, OperationResult>(
    "Operation.Start",
  ),
  Cancel: createRequest<OperationCancelParams, OperationCancelResult>(
    "Operation.Cancel",
  ),
  Progress: createNotification<OperationProgressNotification>(
    "Operation.Progress",
  ),
};

export const Game = {
  FindUploads: createRequest<GameFindUploadsParams, GameFindUploadsResult>(
    "Game.FindUploads",
  ),
};

export const PickUpload = createRequest<PickUploadParams, PickUploadResult>(
  "PickUpload",
);

export const GetReceipt = createRequest<GetReceiptParams, GetReceiptResult>(
  "GetReceipt",
);

export const Log = createNotification<{
  level: string;
  message: string;
}>("Log");

export enum TaskReason {
  Install = "install",
  Uninstall = "uninstall",
}

export enum TaskType {
  // something is being downloaded to the staging folder
  Download = "download",
  // something is being extracted (directly by butler, or by
  // a third-party installer)
  Install = "install",
  // something is being wiped (directly by butler, or by
  // a third-party installer)
  Uninstall = "uninstall",
  // a patch is being applied
  Update = "update",
  // files are being compared with a build's signature,
  // and healed from its archive or any other suitable source
  Heal = "heal",
}

export const TaskStarted = createNotification<{
  reason: TaskReason;
  type: TaskType;
  game: itchio.Game;
  upload: itchio.Upload;
  build: itchio.Build;
  totalSize?: number;
}>("TaskStarted");

export const TaskSucceeded = createNotification<{
  type: TaskType;
  installResult?: InstallResult;
}>("TaskSucceeded");

//---------------------------------------------------------------------
// Launch
//---------------------------------------------------------------------

export interface LaunchParams {
  installFolder: string;
}

export interface LaunchResult {}

export const Launch = createRequest<LaunchParams, LaunchResult>("Launch");

export interface LaunchRunningNotification {}
export const LaunchRunning = createNotification<LaunchRunningNotification>(
  "LaunchRunning",
);

export interface LaunchExitedNotification {}
export const LaunchExited = createNotification<LaunchExitedNotification>(
  "LaunchExited",
);

export interface ShellLaunchParams {
  itemPath: string;
}

export interface ShellLaunchResult {}
export const ShellLaunch = createRequest<ShellLaunchParams, ShellLaunchResult>(
  "ShellLaunch",
);

export interface HTMLLaunchParams {
  rootFolder: string;
  indexPath: string;
}

export interface HTMLLaunchResult {}
export const HTMLLaunch = createRequest<HTMLLaunchParams, HTMLLaunchResult>(
  "HTMLLaunch",
);

//---------------------------------------------------------------------
// CleanDownloads
//---------------------------------------------------------------------

export interface CleanDownloadsEntry {
  path: string;
  size: number;
}

export interface CleanDownloadsSearchParams {
  roots: string[];
  whitelist: string[];
}
export interface CleanDownloadsSearchResult {
  entries: CleanDownloadsEntry[];
}

export interface CleanDownloadsApplyParams {
  entries: CleanDownloadsEntry[];
}
export interface CleanDownloadsApplyResult {}

export const CleanDownloads = {
  Search: createRequest<CleanDownloadsSearchParams, CleanDownloadsSearchResult>(
    "CleanDownloads.Search",
  ),
  Apply: createRequest<CleanDownloadsApplyParams, CleanDownloadsApplyResult>(
    "CleanDownloads.Apply",
  ),
};

//---------------------------------------------------------------------
// Error codes
//---------------------------------------------------------------------

export const Codes = {
  OperationCancelled: 499,
  OperationAborted: 410,
};

//---------------------------------------------------------------------
// Miscellaneous
//---------------------------------------------------------------------

export interface DoublePayload {
  number: number;
}

export const Test = {
  DoubleTwiceRequest: createRequest<DoublePayload, DoublePayload>(
    "Test.DoubleTwice",
  ),
  DoubleRequest: createRequest<DoublePayload, DoublePayload>("Test.Double"),
};
