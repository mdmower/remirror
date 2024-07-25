import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { PointerEvent, useEffect, useMemo } from 'react';
import { uniqueBy } from '@remirror/core';
import { CodeBlockExtension, codeBlockPositioner } from '@remirror/extension-code-block';
import { useCommands, useExtension } from '@remirror/react-core';
import { usePositioner } from '@remirror/react-hooks';

export interface CodeBlockLanguageSelectProps {
  languages?: Array<{ displayName: string; value?: string }>;
  className?: string;
  onLanguageChange?: (language: string, element: HTMLElement | undefined) => boolean;
  onPointerDownSelect?: (event: PointerEvent<HTMLDivElement>) => boolean;
  onSelectChange?: (event: SelectChangeEvent) => boolean;
}

export const CodeBlockLanguageSelect = ({
  languages = [],
  className,
  onLanguageChange,
  onPointerDownSelect,
  onSelectChange,
}: CodeBlockLanguageSelectProps): JSX.Element | null => {
  const { ref, element, data, active } = usePositioner(codeBlockPositioner, []);
  const { focus, updateCodeBlock } = useCommands();

  const { defaultLanguage, supportedLanguages } = useExtension(CodeBlockExtension).options;
  const currentNodeLanguage: string | undefined = active ? data.node.attrs.language : undefined;

  const languageAliases: Map<string, string> = useMemo(() => {
    const result: Map<string, string> = new Map();

    const languagesDisplayNames = new Set(languages.map((lang) => lang.displayName));

    for (const { displayName, aliases } of supportedLanguages) {
      for (const alias of aliases) {
        if (!languagesDisplayNames.has(alias)) {
          result.set(alias, displayName);
        }
      }
    }

    return result;
  }, [supportedLanguages, languages]);

  const languageOptions = useMemo(() => {
    const allLanguages: Array<{ displayName: string; value?: string }> = [
      ...languages,
      {
        displayName: defaultLanguage,
      },
      ...supportedLanguages,
    ];

    return uniqueBy(allLanguages, (lang) => lang.displayName).sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
  }, [languages, defaultLanguage, supportedLanguages]);

  const currentDisplayLanguage = useMemo(() => {
    if (!currentNodeLanguage) {
      return defaultLanguage;
    }

    const alias = languageAliases.get(currentNodeLanguage);

    if (alias) {
      return alias;
    }

    if (languageOptions.some((lang) => lang.displayName === currentNodeLanguage)) {
      return currentNodeLanguage;
    }

    return defaultLanguage;
  }, [languageAliases, languageOptions, defaultLanguage, currentNodeLanguage]);

  useEffect(() => {
    onLanguageChange?.(currentDisplayLanguage, element);
  }, [onLanguageChange, currentDisplayLanguage, element]);

  const handleChange = (e: SelectChangeEvent) => {
    if (onSelectChange?.(e)) {
      return;
    }

    updateCodeBlock({
      language: e.target.value,
    });
  };

  if (!active) {
    return null;
  }

  return (
    <FormControl ref={ref} margin='none' size='small' sx={{ m: 1 }} className={className}>
      <Select
        sx={{
          bgcolor: 'background.paper',
        }}
        onBlur={() => focus()}
        onChange={handleChange}
        onPointerDown={onPointerDownSelect}
        value={currentDisplayLanguage}
        autoWidth
      >
        {languageOptions.map(({ displayName, value }) => (
          <MenuItem key={displayName} value={value ?? displayName}>
            {displayName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
