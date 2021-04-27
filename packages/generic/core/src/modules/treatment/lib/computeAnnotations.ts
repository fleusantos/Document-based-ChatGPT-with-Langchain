import { annotationType } from '../../annotation';
import { annotationsDiffModule, annotationsDiffType } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';
import { sortInConsistentOrder } from './sortInConsistentOrder';

export { computeAnnotations, computeAnnotationsDiff };

function computeAnnotations(treatments: treatmentType[]): annotationType[] {
  const sortedTreatments = sortInConsistentOrder(treatments);

  if (checkTreatmentsConsistency(sortedTreatments) && areAnnotationsInitiallyEmpty(treatments)) {
    const annotationsDiffs = sortedTreatments.map((treatment) => treatment.annotationsDiff);
    return annotationsDiffModule.lib.squash(annotationsDiffs).after;
  } else {
    throw new Error('Can not compute annotations from inconsistent treatments');
  }
}

function computeAnnotationsDiff(treatments: treatmentType[]): annotationsDiffType {
  const sortedTreatments = sortInConsistentOrder(treatments);

  if (checkTreatmentsConsistency(sortedTreatments)) {
    const annotationsDiffs = sortedTreatments.map((treatment) => treatment.annotationsDiff);
    return annotationsDiffModule.lib.squash(annotationsDiffs);
  } else {
    throw new Error('Can not compute annotations from inconsistent treatments');
  }
}

function checkTreatmentsConsistency(treatments: treatmentType[]): boolean {
  return (
    areOnTheSameDocument(treatments) && haveConsistentOrder(treatments) && doesNotHaveMissingTreatments(treatments)
  );
}

function areOnTheSameDocument(treatments: treatmentType[]): boolean {
  return treatments.every((treatment) => idModule.lib.equalId(treatment.documentId, treatments[0].documentId));
}

function haveConsistentOrder(treatments: treatmentType[]): boolean {
  return treatments.reduce(
    (hasConsistentOrder, treatment, index) =>
      hasConsistentOrder && (index === 0 || treatment.order > treatments[index - 1].order),
    true as boolean,
  );
}

function doesNotHaveMissingTreatments(treatments: treatmentType[]): boolean {
  return treatments.reduce(
    (hasConsistentOrder, treatment, index) =>
      hasConsistentOrder && (index === 0 || treatment.order - treatments[index - 1].order === 1),
    true as boolean,
  );
}

function areAnnotationsInitiallyEmpty(treatments: treatmentType[]): boolean {
  return treatments[0].annotationsDiff.before.length === 0;
}
