import { documentType, documentModule, stringComparator } from '@label/core';

export { extractRoute };

function extractRoute({
  solution,
  session,
  publicationCategory,
  chamberId,
  civilMatterCode,
  civilCaseCode,
  criminalCaseCode,
  source,
}: {
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  publicationCategory: documentType['publicationCategory'];
  chamberId: string;
  civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
  civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
  criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
  source: documentType['source'];
}): documentType['route'] {
  if (source !== 'jurinet') {
    return 'exhaustive';
  }
  if (stringComparator.compareNormalizedStrings(solution, 'Non-admission')) {
    return 'automatic';
  }
  if (publicationCategory.includes('C')) {
    return 'confirmation';
  }
  if (chamberId === 'AVIS') {
    return 'confirmation';
  }
  if (['PL', 'MI'].includes(session)) {
    return 'confirmation';
  }
  if (
    documentModule.lib.publicationHandler.mustBePublished(
      publicationCategory,
    ) ||
    publicationCategory.includes('L') ||
    publicationCategory.includes('R')
  ) {
    return 'exhaustive';
  }

  if (chamberId === 'CR') {
    return 'exhaustive';
  }
  if (
    [
      'ASEDU',
      'SUREN',
      'ACTRA',
      'SECU',
      'ALSPE',
      'ASSNN',
      'ASSOS',
      'CONTE',
      'PRESF',
      'RGSPE',
      'ASSCC',
    ].includes(civilMatterCode)
  ) {
    return 'exhaustive';
  }

  if (['FP', 'FS'].includes(session)) {
    return 'exhaustive';
  }

  if (['QPC', 'QPCR'].includes(civilCaseCode) || criminalCaseCode === 'QPC') {
    return 'exhaustive';
  }

  if (
    ['Déchéance', 'Désistement', 'Désistement par arrêt'].some((text) =>
      stringComparator.compareNormalizedStrings(text, solution),
    )
  ) {
    return 'automatic';
  }

  if (publicationCategory.includes('D')) {
    return 'simple';
  }

  if (session === 'FRH' || session === 'FRR') {
    return 'simple';
  }

  if (
    stringComparator.compareNormalizedStrings(
      'Rejet non spécialement motivé',
      solution,
    )
  ) {
    return 'simple';
  }

  return 'default';
}
