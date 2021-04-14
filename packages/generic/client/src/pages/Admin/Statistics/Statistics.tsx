import React from 'react';
import { apiRouteOutType } from '@label/core';
import { aggregatedStatisticType, StatisticsBox } from './StatisticsBox';

export { Statistics };

function Statistics(props: { statistics: apiRouteOutType<'get', 'statistics'> }) {
  const aggregatedStatistic = props.statistics.reduce(
    (accumulator, statistic) => ({
      addedAnnotationsCount: accumulator.addedAnnotationsCount + statistic.addedAnnotationsCount,
      annotationsCount: accumulator.annotationsCount + statistic.annotationsCount,
      deletedAnnotationsCount: accumulator.deletedAnnotationsCount + statistic.deletedAnnotationsCount,
      linkedEntitiesCount: accumulator.linkedEntitiesCount + statistic.linkedEntitiesCount,
      modifiedAnnotationsCount: accumulator.modifiedAnnotationsCount + statistic.modifiedAnnotationsCount,
      resizedBiggerAnnotationsCount:
        accumulator.resizedBiggerAnnotationsCount + statistic.resizedBiggerAnnotationsCount,
      resizedSmallerAnnotationsCount:
        accumulator.resizedSmallerAnnotationsCount + statistic.resizedSmallerAnnotationsCount,
      treatmentDuration: accumulator.treatmentDuration + statistic.treatmentDuration,
      wordsCount: accumulator.wordsCount + statistic.wordsCount,
    }),
    {
      addedAnnotationsCount: 0,
      annotationsCount: 0,
      deletedAnnotationsCount: 0,
      linkedEntitiesCount: 0,
      modifiedAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
      treatmentDuration: 0,
      wordsCount: 0,
    } as aggregatedStatisticType,
  );
  return <StatisticsBox aggregatedStatistic={aggregatedStatistic} statisticsCount={props.statistics.length} />;
}
