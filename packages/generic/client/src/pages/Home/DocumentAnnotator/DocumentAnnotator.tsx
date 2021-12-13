import React, { ReactElement, useRef } from 'react';
import { settingsModule } from '@label/core';
import { heights, widths } from '../../../styles';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode';
import { useMonitoring } from '../../../services/monitoring';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { useKeyboardShortcutsHandler } from './hooks';
import { annotationPerCategoryAndEntityType, getSplittedTextByLine, groupByCategoryAndEntity } from './lib';
import { DocumentAnnotatorFooter } from './DocumentAnnotatorFooter';
import { AnonymizerBuilderContextProvider } from '../../../services/anonymizer';
import { ViewerScrollerContextProvider } from '../../../services/viewerScroller';

export { DocumentAnnotator };

function DocumentAnnotator(props: { onStopAnnotatingDocument?: () => Promise<void> }): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  useKeyboardShortcutsHandler([
    { key: 'z', ctrlKey: true, action: onRevertState },
    { key: 'Z', ctrlKey: true, shiftKey: true, action: onRestoreState },
  ]);
  const viewerRef = useRef(null);

  const annotatorState = annotatorStateHandler.get();
  const styles = buildStyles();
  const categories = settingsModule.lib.getCategories(annotatorState.settings, {
    status: ['annotable'],
    canBeAnnotatedBy: 'human',
  });
  const nonAnnotableCategories = settingsModule.lib.getCategories(annotatorState.settings, {
    status: ['hidden', 'alwaysVisible', 'visible'],
    canBeAnnotatedBy: 'NLP',
  });
  const annotationPerCategoryAndEntity = groupByCategoryAndEntity(annotatorState.annotations, categories).sort(
    sortAdditionalAnnotationsFirst,
  );
  const splittedTextByLine = getSplittedTextByLine(annotatorState.document.text, annotatorState.annotations);

  return (
    <AnonymizerBuilderContextProvider
      annotations={annotatorState.annotations}
      document={annotatorState.document}
      settings={annotatorState.settings}
    >
      <DocumentViewerModeHandlerContextProvider>
        <ViewerScrollerContextProvider viewerRef={viewerRef}>
          <>
            <div style={styles.annotatorBody}>
              <div style={styles.leftContainer}>
                <AnnotationsPanel
                  document={annotatorState.document}
                  annotationPerCategoryAndEntity={annotationPerCategoryAndEntity}
                  splittedTextByLine={splittedTextByLine}
                  nonAnnotableCategories={nonAnnotableCategories}
                />
              </div>
              <div style={styles.rightContainer}>
                <DocumentPanel splittedTextByLine={splittedTextByLine} />
              </div>
            </div>
            <DocumentAnnotatorFooter onStopAnnotatingDocument={props.onStopAnnotatingDocument} />
          </>
        </ViewerScrollerContextProvider>
      </DocumentViewerModeHandlerContextProvider>
    </AnonymizerBuilderContextProvider>
  );

  function onRevertState() {
    addMonitoringEntry({ origin: 'shortcut', action: 'revert' });
    annotatorStateHandler.revert();
  }

  function onRestoreState() {
    addMonitoringEntry({ origin: 'shortcut', action: 'restore' });
    annotatorStateHandler.restore();
  }

  function sortAdditionalAnnotationsFirst(
    { category: categoryA }: annotationPerCategoryAndEntityType[number],
    { category: categoryB }: annotationPerCategoryAndEntityType[number],
  ) {
    const additionalAnnotationCategoryName = settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName();
    if (categoryA === additionalAnnotationCategoryName) {
      return -1;
    }
    if (categoryB === additionalAnnotationCategoryName) {
      return 1;
    }
    return 0;
  }

  function buildStyles() {
    return {
      annotatorHeader: {
        height: heights.header,
      },
      annotatorBody: {
        display: 'flex',
      },
      leftContainer: {
        display: 'flex',
        width: widths.annotationsPanel,
      },
      rightContainer: {
        display: 'flex',
        width: widths.documentPanel,
      },
    };
  }
}
