import React, { CSSProperties } from 'react';
import { uniq } from 'lodash';
import { Theme, useTheme } from '@material-ui/core';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { LayoutGrid, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { heights } from '../../../../styles';
import { CategoryTable } from './CategoryTable';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
}) {
  const theme = useTheme();
  const styles = buildStyles(theme);
  const categories = uniq(props.annotatorStateHandler.get().annotations.map((annotation) => annotation.category));

  return (
    <LayoutGrid style={styles.panel}>
      <LayoutGrid container alignItems="center" style={styles.panelHeader}>
        <LayoutGrid item>
          <Text variant="h2">{wordings.askedAnnotations}</Text>
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid style={styles.categoriesContainer}>
        {categories.map((category) => (
          <LayoutGrid key={category} style={styles.category}>
            <CategoryTable
              annotatorStateHandler={props.annotatorStateHandler}
              anonymizer={props.anonymizer}
              category={category}
            />
          </LayoutGrid>
        ))}
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: Theme): { [cssClass: string]: CSSProperties } {
    return {
      panel: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(4),
      },
      panelHeader: {
        height: heights.panelHeader,
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.panel,
      },
      category: {
        marginBottom: theme.spacing(3),
      },
    };
  }
}
