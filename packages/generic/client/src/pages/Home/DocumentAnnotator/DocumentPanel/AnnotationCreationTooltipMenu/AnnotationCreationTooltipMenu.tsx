import React, { ReactElement, useState, CSSProperties } from 'react';
import { annotationTextDetector, fetchedAnnotationHandler, settingsModule } from '@label/core';
import {
  ActionIcon,
  CategoryIcon,
  Checkbox,
  LabelledDropdown,
  LayoutGrid,
  Text,
  TooltipMenu,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { customThemeType, useCustomTheme } from '../../../../../styles';

export { AnnotationCreationTooltipMenu };

const CATEGORY_ICON_SIZE = 30;

function AnnotationCreationTooltipMenu(props: {
  anchorText: Element;
  annotatorStateHandler: annotatorStateHandlerType;
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
}): ReactElement {
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);
  const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices(
    annotatorState.document.text,
    props.annotationText,
    annotatorState.annotations,
  );
  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid container direction="column" alignItems="center">
        <LayoutGrid item style={styles.annotationTextContainer}>
          <Text variant="body2" style={styles.annotationText}>
            {props.annotationText}
          </Text>
        </LayoutGrid>
        <LayoutGrid item style={styles.identicalOccurrencesContainer}>
          <Text variant="h3">
            <span style={styles.identicalOccurrencesNumber}>{annotationTextsAndIndices.length}</span>{' '}
            {wordings.identicalOccurrencesSpotted}
          </Text>
        </LayoutGrid>
        <LayoutGrid item container>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid item container>
          <LabelledDropdown
            items={categories.map((category) => ({
              icon: (
                <CategoryIcon
                  annotatorStateHandler={props.annotatorStateHandler}
                  category={category}
                  iconSize={CATEGORY_ICON_SIZE}
                />
              ),
              text: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
              value: category,
            }))}
            label={wordings.category}
            labelIcon={<ActionIcon iconName="bank" iconSize={CATEGORY_ICON_SIZE} />}
            onChange={applyAnnotationCreation}
          />
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    const newAnnotations = shouldApplyEverywhere
      ? fetchedAnnotationHandler.createAll(category, annotationTextsAndIndices, annotatorState.annotations)
      : fetchedAnnotationHandler.create(
          category,
          props.annotationIndex,
          props.annotationText,
          annotatorState.annotations,
        );

    props.annotatorStateHandler.set({
      ...annotatorState,
      annotations: newAnnotations,
    });

    props.onClose();
  }

  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      annotationTextContainer: {
        marginBottom: theme.spacing * 2,
      },
      annotationText: {
        backgroundColor: theme.colors.default.hoveredBackground,
        color: theme.colors.default.hoveredTextColor,
        padding: '2px 4px',
        borderRadius: '3px',
      },
      identicalOccurrencesContainer: {
        marginBottom: theme.spacing * 4,
      },
      identicalOccurrencesNumber: {
        fontWeight: 'bold',
      },
    };
  }
}
