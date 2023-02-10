import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import TextField from '@commercetools-uikit/text-field';
import DateField from '@commercetools-uikit/date-field';
import SelectField from '@commercetools-uikit/select-field';
import FieldLabel from '@commercetools-uikit/field-label';
import MultilineTextInput from '@commercetools-uikit/multiline-text-input';

export const formSections = [
  {
    name: 'API Configuration',
    subSections: [
      {
        name: '',
        children: [
          {
            id: 'info',
            title: 'Information',
            type: 'label',
            value: 'Currently installed version: 1.0.22',
          },
          {
            id: 'enabled',
            title: 'Enabled',
            type: 'multiple',
            options: [
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' },
            ],
          },
          {
            id: 'display',
            title: 'Display Type',
            type: 'multiple',
            options: [{ value: 'webcheckout', label: 'Gr4vy Web Checkout' }],
          },
          {
            id: 'gr4vyId',
            title: 'Gr4vy ID',
            type: 'text',
          },
          {
            id: 'privateId',
            title: 'Private id',
            type: 'file',
          },
          {
            id: 'env',
            title: 'Enviroment',
            type: 'multiple',
            options: [
              { value: 'sandbox', label: 'Sandbox' },
              { value: 'production', label: 'Production' },
            ],
          },
          {
            id: 'enableDebug',
            title: 'Enable Debug',
            type: 'multiple',
            options: [
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' },
            ],
          },
          {
            id: 'paymentAction',
            title: 'Payment Action',
            type: 'multiple',
            options: [
              { value: 'authorize', label: 'Authorize Only' },
              { value: 'capture', label: 'Authorize & Capture' },
            ],
          },
          {
            id: 'title',
            title: 'Title',
            type: 'text',
          },
          {
            id: 'instructions',
            title: 'Instructions',
            type: 'multi-line',
          },
          {
            id: 'newOrderStatus',
            title: 'New Order Status',
            type: 'multiple',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'fraud', label: 'Suspended Fraud' },
            ],
          },
          {
            id: 'paymentFromApplicableCountries',
            title: 'Payment From Applicable countries',
            type: 'multiple',
            options: [
              { value: 0, label: 'All Allowed Countries' },
              { value: 1, label: 'Specific Countries' },
            ],
          },
          {
            id: 'paymentFromApplicableCountriesList',
            title: 'Payment From Applicable countries',
            type: 'multiple',
            disabled: true,
            options: [],
          },
          {
            id: 'sortOrder',
            title: 'Sort Order',
            type: 'text',
          },
        ],
      },
    ],
  },
  {
    name: 'Options',
    subSections: [
      {
        name: '',
        children: [
          {
            id: 'paymentSource',
            title: 'Payment Source',
            type: 'multiple',
            options: [
              { value: 'ecommerce', label: 'Ecommerce' },
              { value: 'card_on_file', label: 'Card On File' },
              { value: 'installment', label: 'Installment' },
              { value: 'moto', label: 'Moto' },
              { value: 'recurring', label: 'Recurring' },
            ],
          },
          {
            id: 'paymentStore',
            title: 'Payment Store',
            type: 'multiple',
            options: [
              { value: 'ask', label: 'Ask' },
              { value: 1, label: 'Yes' },
              { value: null, label: 'No' },
            ],
          },
          {
            id: 'customData',
            title: 'Custom Data',
            type: 'text',
          },
          {
            id: 'requireSecurityCode',
            title: 'Require Security Code',
            type: 'multiple',
            options: [
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' },
            ],
          },
        ],
      },
      {
        name: 'Statement Descriptor',
        children: [
          {
            id: 'statementName',
            title: 'Statement Name',
            type: 'text',
          },
          {
            id: 'statementDescription',
            title: 'Statement Description',
            type: 'text',
          },
          {
            id: 'stateCity',
            title: 'Statement City',
            type: 'text',
          },
          {
            id: 'statementPhoneNumber',
            title: 'Statement Phone Number',
            type: 'text',
          },
          {
            id: 'statementUrl',
            title: 'Statement Url',
            type: 'text',
          },
        ],
      },
    ],
  },
  {
    name: 'Theme',
    subSections: [
      {
        name: 'Fonts',
        children: [
          {
            id: 'fontBody',
            title: 'Font Body',
            type: 'text',
          },
        ],
      },
      {
        name: 'Colors',
        children: [
          {
            id: 'textColor',
            title: 'Text Color',
            type: 'colorPalette',
          },
          {
            id: 'subtleTextColor',
            title: 'Subtle Text Color',
            type: 'colorPalette',
          },
          {
            id: 'labelTextColor',
            title: 'Label Text Color',
            type: 'colorPalette',
          },
          {
            id: 'primaryColor',
            title: 'Primary Color',
            type: 'colorPalette',
          },
          {
            id: 'pageBackgroundColor',
            title: 'Page Background Color',
            type: 'colorPalette',
          },
          {
            id: 'containerBackgroundUncheckColor',
            title: 'Container Background Uncheck Color',
            type: 'colorPalette',
          },
          {
            id: 'containerBackgroundColor',
            title: 'Container Backgroung Color',
            type: 'colorPalette',
          },
          {
            id: 'containerBorderColor',
            title: 'Container Border Color',
            type: 'colorPalette',
          },
          {
            id: 'inputBorderColor',
            title: 'Input Border Color',
            type: 'colorPalette',
          },
          {
            id: 'inputBackgroundColor',
            title: 'Input Background Color',
            type: 'colorPalette',
          },
          {
            id: 'inputTextColor',
            title: 'Input Text Color',
            type: 'colorPalette',
          },
          {
            id: 'inputRadioBorderColor',
            title: 'Input Radio Border Color',
            type: 'colorPalette',
          },
          {
            id: 'inputRadioBorderCheckedColor',
            title: 'Input Radio Border Checked Color',
            type: 'colorPalette',
          },
          {
            id: 'dangerColor',
            title: 'Danger Color',
            type: 'colorPalette',
          },
          {
            id: 'dangerBackgroundColor',
            title: 'Danger Background Color',
            type: 'colorPalette',
          },
          {
            id: 'dangerTextColor',
            title: 'Danger Text Color',
            type: 'colorPalette',
          },
          {
            id: 'infoColor',
            title: 'Info Color',
            type: 'colorPalette',
          },
          {
            id: 'infoBackgroundColor',
            title: 'Info Background Color',
            type: 'colorPalette',
          },
          {
            id: 'infoTextColor',
            title: 'Info Text Color',
            type: 'colorPalette',
          },
          {
            id: 'focusColor',
            title: 'Focus Color',
            type: 'colorPalette',
          },
        ],
      },
      {
        name: 'Borders',
        children: [
          {
            id: 'containerBorderWidth',
            title: 'containerBorderWidth',
            type: 'text',
          },
          {
            id: 'inputBorderWidth',
            title: 'Input Border Width',
            type: 'text',
          },
        ],
      },
      {
        name: 'Radii',
        children: [
          {
            id: 'container',
            title: 'Container',
            type: 'text',
          },
          {
            id: 'input',
            title: 'Input',
            type: 'text',
          },
        ],
      },
      {
        name: 'Shadows',
        children: [
          {
            id: 'focusRing',
            title: 'Font Ring',
            type: 'colorPalette',
          },
        ],
      },
    ],
  },
];

export const getField = ({
  id,
  type,
  title,
  value,
  name,
  eventTrigger,
  options,
  disabled = false,
  key,
}) => {
  switch (type) {
    case 'label':
      return (
        <>
          <FieldLabel htmlFor={id} title={title} key={key} />
        </>
      );
    case 'text':
      return (
        <>
          <TextField
            id={id}
            title={title}
            value={value ? value : ''}
            name={name}
            onChange={eventTrigger}
            isDisabled={disabled}
            key={key}
          />
        </>
      );
    case 'date':
      return (
        <>
          <DateField
            id={id}
            title={title}
            value={value}
            onChange={eventTrigger}
            isDisabled={disabled}
            key={key}
          />
        </>
      );
    case 'multiple':
      return (
        <SelectField
          id={id}
          title={title}
          value={value}
          options={options ? options : []}
          onChange={eventTrigger}
          isDisabled={disabled}
          key={key}
        />
      );
    case 'multi-line':
      return (
        <>
          <FieldLabel htmlFor={id} title={title} />
          <MultilineTextInput
            id={id}
            title={title}
            value={value ? value : ''}
            options={options}
            onChange={eventTrigger}
            isDisabled={disabled}
            key={key}
          />
        </>
      );
    case 'file':
      return (
        <>
          <FieldLabel htmlFor={id} title={title} />
          <input
            id={id}
            type="file"
            name={id}
            onChange={eventTrigger}
            disabled={disabled}
            key={key}
          />
        </>
      );
    case 'colorPalette':
      return (
        <>
          <FieldLabel htmlFor={id} title={title} />
          <input
            type="color"
            id={id}
            name={id}
            value={value}
            onChange={eventTrigger}
            disabled={disabled}
            key={key}
          />
        </>
      );
  }
};
