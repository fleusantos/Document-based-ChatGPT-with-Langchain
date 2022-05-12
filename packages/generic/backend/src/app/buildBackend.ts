import { environmentType, settingsType } from '@label/core';
import { buildRunScript } from './buildRunScript';
import { buildRunServer } from './buildRunServer';
import {
  cleanDocuments,
  clearDb,
  createMigrationFile,
  deleteDocument,
  displayDocumentLinks,
  displayMultipleAssignatedDocuments,
  dumpDocument,
  extractComplexityInfoIntoCsv,
  extractMonitoringEntriesIntoCsv,
  extractRouteInfosIntoCsv,
  freePendingDocuments,
  insertTestUsers,
  insertUser,
  listAllDocuments,
  listDocumentsWithProblemReports,
  purgeDb,
  renewCache,
  resetUntreatedDocumentsForTest,
  revertOneMigration,
  runNewMigrations,
} from './scripts';

export { buildBackend };

function buildBackend(environment: environmentType, settings: settingsType) {
  const runServer = buildRunServer(environment, settings);
  const runScript = buildRunScript(environment);

  return {
    runServer,
    runScript,
    scripts: {
      cleanDocuments: {
        run: cleanDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      clearDb: {
        run: clearDb,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      createMigrationFile: {
        run: createMigrationFile,
        option: { shouldLoadDb: false, shouldExit: true },
      },
      deleteDocument: {
        run: deleteDocument,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      displayDocumentLinks: {
        run: displayDocumentLinks,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      displayMultipleAssignatedDocuments: {
        run: displayMultipleAssignatedDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      dumpDocument: {
        run: dumpDocument,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      extractMonitoringEntriesIntoCsv: {
        run: extractMonitoringEntriesIntoCsv,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      extractComplexityInfoIntoCsv: {
        run: extractComplexityInfoIntoCsv,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      extractRouteInfosIntoCsv: {
        run: extractRouteInfosIntoCsv,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      freePendingDocuments: {
        run: freePendingDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      insertTestUsers: {
        run: insertTestUsers,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      insertUser: {
        run: insertUser,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      listAllDocuments: {
        run: listAllDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      listDocumentsWithProblemReports: {
        run: listDocumentsWithProblemReports,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      purgeDb: {
        run: purgeDb,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      renewCache: {
        run: renewCache,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      revertOneMigration: {
        run: revertOneMigration,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      resetUntreatedDocumentsForTest: {
        run: resetUntreatedDocumentsForTest,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      runNewMigrations: {
        run: runNewMigrations,
        option: { shouldLoadDb: true, shouldExit: true },
      },
    },
  };
}
