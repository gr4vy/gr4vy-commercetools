import TextField from '@commercetools-uikit/text-field';
import DateField from '@commercetools-uikit/date-field';
import SelectField from '@commercetools-uikit/select-field';
import MultilineTextInput from '@commercetools-uikit/multiline-text-input';
import Spacings from '@commercetools-uikit/spacings';
import PhoneInput from 'react-phone-number-input';

// Gr4vy Form and Values
export const formSections = [
  {
    name: 'API Configuration',
    subSections: [
      {
        name: '',
        children: [
          {
            id: 'information',
            title: 'Information',
            type: 'label',
            value: 'Currently installed version: 1.0.22',
          },
          {
            id: 'active',
            title: 'Enabled',
            type: 'multiple',
            options: [
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' },
            ],
          },
          {
            id: 'payment_type',
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
            id: 'privateKey',
            title: 'Private Key',
            type: 'file',
          },
          {
            id: 'environment',
            title: 'Enviroment',
            type: 'multiple',
            options: [
              { value: 'sandbox', label: 'Sandbox' },
              { value: 'production', label: 'Production' },
            ],
          },
          {
            id: 'debug',
            title: 'Enable Debug',
            type: 'multiple',
            options: [
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' },
            ],
          },
          {
            id: 'intent',
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
            id: 'allowspecific',
            title: 'Payment From Applicable countries',
            type: 'multiple',
            options: [
              { value: 0, label: 'All Allowed Countries' },
              { value: 1, label: 'Specific Countries' },
            ],
          },
          {
            id: 'specificcountry',
            title: 'Payment Applicable countries List',
            type: 'text',
            disabled: true,
            tooltip: 'Enter only one country',
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
              { value: 0, label: 'No' },
            ],
            tooltip: 'Explicitly store the payment method or ask the buyer',
          },
          {
            id: 'customData',
            title: 'Custom Data',
            type: 'text',
          },
          {
            id: 'requiredSecurityCode',
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
            id: 'name',
            parent: 'statementDescriptor',
            title: 'Statement Name',
            type: 'text',
          },
          {
            id: 'description',
            parent: 'statementDescriptor',
            title: 'Statement Description',
            type: 'text',
          },
          {
            id: 'city',
            parent: 'statementDescriptor',
            title: 'Statement City',
            type: 'text',
          },
          {
            id: 'phoneNumber',
            parent: 'statementDescriptor',
            title: 'Statement Phone Number',
            type: 'phoneNumber',
          },
          {
            id: 'url',
            parent: 'statementDescriptor',
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
            id: 'body',
            parent: 'fonts',
            superParent: 'themeOptions',
            title: 'Font Body',
            type: 'text',
            tooltip: 'Used for all text',
          },
        ],
      },
      {
        name: 'Colors',
        children: [
          {
            id: 'text',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Text Color',
            type: 'colorPalette',
            tooltip: 'Main body text, labels and headers',
          },
          {
            id: 'subtleText',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Subtle Text Color',
            type: 'colorPalette',
            tooltip: 'Hints and Smaller text, e.g. Card Expiry',
          },
          {
            id: 'labelText',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Label Text Color',
            type: 'colorPalette',
            tooltip: 'Hints and Smaller text, e.g. Card Expiry',
          },
          {
            id: 'primary',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Primary Color',
            type: 'colorPalette',
            tooltip: 'Interactive elements or Brand',
          },
          {
            id: 'pageBackground',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Page Background Color',
            type: 'colorPalette',
            tooltip: 'The main body/page of the Embed iFrame',
          },
          {
            id: 'containerBackgroundUnchecked',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Container Background Uncheck Color',
            type: 'colorPalette',
            tooltip:
              'Used for bounding elements, e.g. an individual payment option',
          },
          {
            id: 'containerBackground',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Container Background Color',
            type: 'colorPalette',
          },
          {
            id: 'containerBorder',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Container Border Color',
            type: 'colorPalette',
          },
          {
            id: 'inputBorder',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Input Border Color',
            type: 'colorPalette',
            tooltip: 'Used for inputs',
          },
          {
            id: 'inputBackground',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Input Background Color',
            type: 'colorPalette',
          },
          {
            id: 'inputText',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Input Text Color',
            type: 'colorPalette',
          },
          {
            id: 'inputRadioBorderColor',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Input Radio Border Color',
            type: 'colorPalette',
            tooltip: 'Defaults to container border Color',
          },
          {
            id: 'inputRadioBorderCheckedColor',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Input Radio Border Checked Color',
            type: 'colorPalette',
            tooltip: 'Defaults to primary color',
          },
          {
            id: 'danger',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Danger Color',
            type: 'colorPalette',
            tooltip: 'Used for Error states or Destructive Action',
          },
          {
            id: 'dangerBackground',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Danger Background Color',
            type: 'colorPalette',
          },
          {
            id: 'dangerText',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Danger Text Color',
            type: 'colorPalette',
          },
          {
            id: 'info',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Info Color',
            type: 'colorPalette',
            tooltip: 'Used for information / loading states',
          },
          {
            id: 'infoBackground',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Info Background Color',
            type: 'colorPalette',
          },
          {
            id: 'infoText',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Info Text Color',
            type: 'colorPalette',
          },
          {
            id: 'focus',
            parent: 'colors',
            superParent: 'themeOptions',
            title: 'Focus Color',
            type: 'colorPalette',
            tooltip: 'Color of the focus ring if shadows.focus is not set',
          },
        ],
      },
      {
        name: 'Borders',
        children: [
          {
            id: 'container',
            parent: 'borderWidths',
            superParent: 'themeOptions',
            title: 'container Border Width',
            type: 'text',
            tooltip: 'A bounding layout element.',
          },
          {
            id: 'input',
            parent: 'borderWidths',
            superParent: 'themeOptions',
            title: 'Input Border Width',
            type: 'text',
            tooltip: 'A Form Input, e.g. Card Number',
          },
        ],
      },
      {
        name: 'Radii',
        children: [
          {
            id: 'container',
            parent: 'radii',
            superParent: 'themeOptions',
            title: 'Container',
            type: 'text',
            tooltip: 'A bounding layout element',
          },
          {
            id: 'input',
            parent: 'radii',
            superParent: 'themeOptions',
            title: 'Input',
            type: 'text',
            tooltip: 'A Form Input, e.g. Card Number',
          },
        ],
      },
      {
        name: 'Shadows',
        children: [
          {
            id: 'focusRing',
            parent: 'shadows',
            superParent: 'themeOptions',
            title: 'Focus Ring',
            type: 'text',
            tooltip: 'Surrounds an element that is currently focused',
          },
        ],
      },
    ],
  },
];

// Function to return approriate input field based on type
export const getField = ({
  id,
  type,
  title,
  value,
  name,
  eventTrigger,
  options,
  disabled = false,
  fileName,
}) => {
  switch (type) {
    case 'label':
      return (
        <TextField
          htmlFor={id}
          title={''}
          value={value ? value : ''}
          name={name}
          isReadOnly
        />
      );
    case 'text':
      return (
        <TextField
          id={id}
          title={''}
          value={value ? value : ''}
          name={name}
          onChange={eventTrigger}
          isDisabled={disabled}
        />
      );
    case 'date':
      return (
        <DateField
          id={id}
          title={''}
          value={value}
          onChange={eventTrigger}
          isDisabled={disabled}
        />
      );
    case 'multiple':
      return (
        <SelectField
          id={id}
          title={''}
          value={value}
          options={options ? options : []}
          onChange={eventTrigger}
          isDisabled={disabled}
        />
      );
    case 'multi-line':
      return (
        <MultilineTextInput
          id={id}
          title={''}
          value={value ? value : ''}
          onChange={eventTrigger}
          isDisabled={disabled}
        />
      );
    case 'file':
      return (
        <Spacings.Inline>
          <input
            id={id}
            type="file"
            name={id}
            onChange={eventTrigger}
            style={{ display: 'none' }}
            accept=".pem"
          />
          <input
            type="button"
            value="Browse..."
            onClick={() => document.getElementById(id).click()}
            disabled={disabled}
          />
          {fileName.length > 0 ? (
            <div
              style={{
                maxWidth: '400px',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {fileName}
            </div>
          ) : null}
        </Spacings.Inline>
      );
    case 'colorPalette':
      return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <input
            type="color"
            id={`color_${id}`}
            value={value ? value : '#000000'}
            onChange={(e) => {
              document.getElementsByName(id)[0].value = e.target.value;
            }}
            onBlur={(e) => {
              document.getElementsByName(id)[0].focus();
            }}
            disabled={disabled}
          />
          <input
            className="color-input"
            type="text"
            id={id}
            name={id}
            value={value}
            onFocus={(e) => {
              document.getElementById(`color_${id}`).value = e.target.value;
              eventTrigger(e);
            }}
            onChange={(e) => {
              document.getElementById(`color_${id}`).value = e.target.value;
              eventTrigger(e);
            }}
          />
        </div>
      );
    case 'phoneNumber':
      return (
        <>
          <PhoneInput
            placeholder=" Enter phone number"
            id={id}
            title={''}
            value={value ? value : ''}
            name={name}
            onChange={(e) => eventTrigger(e)}
          />
        </>
      );
    default:
      return null;
  }
};
