import React from 'react';
import { documentType } from '@label/core';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { ButtonWithIcon, ComponentsList, IconButton } from '../../../components';
import { apiCaller } from '../../../api';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { useMonitoring } from '../../../services/monitoring';
import { clientAnonymizerType } from '../../../types';
import { wordings } from '../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorFooter };

function DocumentAnnotatorFooter(props: { anonymizer: clientAnonymizerType; onStopAnnotatingDocument: () => void }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const { getTotalDuration, sendMonitoringEntries } = useMonitoring();

  const styles = buildStyles(theme);
  const annotatorState = annotatorStateHandler.get();

  return (
    <div style={styles.footer}>
      <div style={styles.leftContainer}>
        <div style={styles.resetButtonContainer}>
          <ButtonWithIcon
            color="default"
            iconName="reset"
            onClick={annotatorStateHandler.reinitialize}
            text={wordings.reset}
          />
        </div>
      </div>
      <div style={styles.rightContainer}>
        <ComponentsList
          components={[
            <IconButton
              color="default"
              disabled={!canRevertLastAction()}
              hint={wordings.undo}
              iconName="undo"
              onClick={revertLastAction}
            />,
            <IconButton
              color="default"
              disabled={!canRestoreLastAction()}
              hint={wordings.redo}
              iconName="redo"
              onClick={restoreLastAction}
            />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
        <ComponentsList
          components={[
            <ReportProblemButton onStopAnnotatingDocument={props.onStopAnnotatingDocument} />,
            <IconButton color="default" iconName="copy" onClick={copyToClipboard} hint={wordings.copyToClipboard} />,
            <IconButton color="default" iconName="save" onClick={saveDraft} hint={wordings.saveDraft} />,
            <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.validate} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </div>
    </div>
  );

  function revertLastAction() {
    annotatorStateHandler.revert();
  }

  function restoreLastAction() {
    annotatorStateHandler.restore();
  }

  function canRevertLastAction() {
    return annotatorStateHandler.canRevert();
  }

  function canRestoreLastAction() {
    return annotatorStateHandler.canRestore();
  }

  async function copyToClipboard() {
    const anonymizedDocument = props.anonymizer.anonymizeDocument(annotatorState.document, annotatorState.annotations);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }

  async function saveDraft() {
    await saveAnnotationsAndUpdateAssignationStatus('saved');
  }

  async function validate() {
    await saveAnnotationsAndUpdateAssignationStatus('done');
    await sendMonitoringEntries();
    props.onStopAnnotatingDocument();
  }

  async function saveAnnotationsAndUpdateAssignationStatus(status: documentType['status']) {
    const duration = getTotalDuration();

    await apiCaller.post<'createTreatment'>('createTreatment', {
      documentId: annotatorState.document._id,
      fetchedGraphQLAnnotations: annotatorState.annotations,
      duration,
    });
    await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
      documentId: annotatorState.document._id,
      status,
    });
  }
}

function buildStyles(theme: customThemeType) {
  return {
    footer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      height: heights.annotatorPanelFooter,
    },
    leftContainer: {
      display: 'flex',
      width: widths.annotationsPanel,
    },
    rightContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: widths.documentPanel,
    },
    resetButtonContainer: {
      paddingLeft: theme.spacing * 2,
    },
  };
}
