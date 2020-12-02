import React, { CSSProperties } from 'react';
import { fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  choices: Array<{ annotations: fetchedAnnotationType[]; document: fetchedDocumentType }>;
  settings: settingsType;
  onSelectDocument: (choice: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] }) => void;
}) {
  const styles = buildStyles();
  return (
    <div style={styles.cardsContainer}>
      {props.choices.map((choice) => (
        <DocumentSelectorCard choice={choice} onSelect={props.onSelectDocument} settings={props.settings} />
      ))}
    </div>
  );
}

function buildStyles(): { [cssClass: string]: CSSProperties } {
  return {
    cardsContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-around',
      height: '100vh',
      alignItems: 'center',
    },
  };
}
