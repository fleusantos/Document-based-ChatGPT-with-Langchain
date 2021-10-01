import { uniq } from 'lodash';
import { documentService } from '../../../modules/document';
import { buildDocumentRepository } from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanLoadedDocuments };

async function cleanLoadedDocuments() {
  logger.log(`cleanLoadedDocuments`);

  const documentRepository = buildDocumentRepository();

  logger.log('Fetching "nlpAnnotating" documents');
  const nlpAnnotatingDocuments = await documentRepository.findAllByStatusProjection(
    ['nlpAnnotating'],
    ['_id'],
  );
  const loadedDocuments = await documentRepository.findAllByStatusProjection(
    ['loaded'],
    ['_id'],
  );
  logger.log(`${nlpAnnotatingDocuments.length} nlpAnnotating documents found`);

  for (let i = 0, length = nlpAnnotatingDocuments.length; i < length; i++) {
    await documentService.updateDocumentStatus(
      nlpAnnotatingDocuments[i]._id,
      'loaded',
    );
  }

  logger.log(`"nlpAnnotating" documents status set to "loaded"`);

  logger.log(`${loadedDocuments.length} loaded documents found`);

  const loadedDocumentsIds = loadedDocuments.map(({ _id }) => _id);

  for (let i = 0, length = loadedDocumentsIds.length; i < length; i++) {
    await documentService.resetDocument(loadedDocumentsIds[i]);
  }

  logger.log(`"loaded" documents reset. Fetching non-treated documents...`);
  const notTreatedDocuments = await documentService.fetchDocumentsWithoutAnnotations();
  logger.log(
    `${
      notTreatedDocuments.length
    } not treated documents found. Status are [${uniq(
      notTreatedDocuments.map(({ status }) => status),
    ).join(', ')}]. Setting status to loaded...`,
  );

  for (let i = 0, length = notTreatedDocuments.length; i < length; i++) {
    await documentService.updateDocumentStatus(
      notTreatedDocuments[i]._id,
      'loaded',
    );
  }

  logger.log(`cleanLoadedDocuments done!`);
}
