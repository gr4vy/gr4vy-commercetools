import React, { useState, useEffect } from 'react';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { getField, formSections } from './fields';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { InfoIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import Tooltip from '@commercetools-uikit/tooltip';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ToastContainer, toast } from 'react-toastify';
import { isValidPhoneNumber } from 'react-phone-number-input';
import initialValues from './initValues.json';
import axios from 'axios';
import config from '../../gr4vy.config.json';
import { gravyStatementDescriptorValidator } from '../../constants';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';

const Gr4vy = () => {
  const [sections, setSections] = useState(formSections);
  let [loading, setLoading] = useState(false);
  const dispatch = useAsyncDispatch();
  const [privateIdFile, setPrivateIdFile] = useState({});
  const [deleteFile, setDeleteFile] = useState(false);
  const [apiResponse, setApiResponse] = useState({});
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Function to fetch the custom object
  const fetchCustomObject = async () => {
    setLoading(true);
    try {
      const { results } = await dispatch(
        actions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
        })
      );
      const CustObj = results.filter(
        (res) => res.container === config.GR4VY_CUSTOM_OBJECT_CONTAINER
      )[0];
      if (CustObj?.value) {
        setPrivateIdFile({
          fileContent: CustObj?.value?.privateKey,
          fileName: CustObj?.value?.privateKeyFileName,
        });
        setPhoneNumber(CustObj?.value?.statementDescriptor?.phoneNumber);
        if (CustObj?.value?.themeOptions === undefined) {
          setApiResponse({
            ...CustObj?.value,
            information: config.VERSION,
            themeOptions: {
              ...initialValues?.themeOptions,
            },
          });
        } else {
          setApiResponse({ ...CustObj?.value, information: config.VERSION });
        }
      } else {
        setApiResponse({ ...initialValues, information: config.VERSION });
        setPrivateIdFile({
          fileContent: initialValues?.privateKey,
          fileName: initialValues?.privateKeyFileName,
        });
        setPhoneNumber(initialValues?.statementDescriptor?.phoneNumber);
      }
      // }
    } catch (error) {
      // Update state with `error`
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetches the custom object on component mounting
  useEffect(() => {
    fetchCustomObject();
  }, []);

  //Function to clear cache
  const clearCacheData = () => {
    let axiosConfig = {
      method: 'post',
      url: `${config.API_SERVER_URL}/cache/clear`,
    };
    axios(axiosConfig)
      .then(function ({ data }) {
        return data;
      })
      .catch(function (error) {
        return error;
      });
  };

  // Function to save the custom object
  const saveCustomObject = async (payload) => {
    try {
      const result = await dispatch(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          payload: {
            container: config.GR4VY_CUSTOM_OBJECT_CONTAINER,
            key: config.GR4VY_CUSTOM_OBJECT_CONTAINER_KEY,
            value: payload,
          },
        })
      );
      formik.resetForm();
      if (result) {
        clearCacheData();
        toast('Configuration saved successfully', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: false,
          theme: 'light',
          type: 'success',
        });
      }
      fetchCustomObject();
    } catch (error) {
      toast('Failed to save configuration', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: false,
        theme: 'light',
        type: 'error',
      });
      setLoading(false);
    }
  };

  //Function to validate Statement Descriptor
  const statementDescriptorValidator = (value, field) => {
    const len = value.length;
    const { url, city, name, phone } = gravyStatementDescriptorValidator;
    switch (field) {
      case 'url':
        const urlPattern =
          /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
        if (len < url.min || len > url.max) return true;
        if (!urlPattern.test(value)) return true;
        return false;
      case 'city':
        if (len < city.min || len > city.max) return true;
        return false;
      case 'name':
      case 'description':
        const strPattern = /([^<>\\'"*][a-zA-Z0-9.,_\-?+/])/;
        if (len < name.min || len > name.max) return true;
        if (!strPattern.test(value)) return true;
        return false;
      case 'phoneNumber':
        if (len < phone.min || len > phone.max) return true;
        if (!isValidPhoneNumber(phoneNumber)) return true;
        return false;
    }
  };

  // Formik componet initialization
  let formik = useFormik({
    initialValues: apiResponse,
    onReset: () => {
      const colorInputElements = document.getElementsByClassName('color-input');
      for (let i = 0; i < colorInputElements.length; i++) {
        colorInputElements[i].value = '';
      }
    },
    onSubmit: (values) => {
      setLoading(true);

      if (deleteFile) {
        delete values.privateKey;
        delete values.privateKeyFileName;
      } else if (privateIdFile?.fileContent) {
        values = {
          ...values,
          privateKey: privateIdFile.fileContent,
          privateKeyFileName: privateIdFile.fileName,
        };
      }

      values = {
        ...values,
        statementDescriptor: {
          ...values.statementDescriptor,
          phoneNumber: phoneNumber ? phoneNumber : '',
        },
      };

      if (Object.keys(values?.statementDescriptor).length > 0) {
        for (let key of Object.keys(values?.statementDescriptor)) {
          if (values?.statementDescriptor[key]) {
            const status = statementDescriptorValidator(
              values?.statementDescriptor[key],
              key
            );
            if (status) {
              toast(`Please enter valid ${key}`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: false,
                theme: 'light',
                type: 'error',
              });
              setLoading(false);
              return null;
            }
          } else {
            delete values?.statementDescriptor[key];
          }
        }
      }

      // ---------------Removing unwanted keys from payload - GROPT-189--------------
      for (let theme of Object.keys(values?.themeOptions)) {
        if (
          values?.themeOptions[theme] === undefined ||
          Object.keys(values?.themeOptions[theme]).length === 0
        ) {
          delete values?.themeOptions[theme];
        } else {
          for (let key of Object.keys(values?.themeOptions[theme])) {
            if (
              values?.themeOptions[theme][key] === undefined ||
              values?.themeOptions[theme][key].length === 0
            ) {
              delete values?.themeOptions[theme][key];
            }
          }
        }
      }

      saveCustomObject({
        ...values,
      });
    },
    enableReinitialize: true,
  });

  const getFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to handle file upload to REST server
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const fileReader = await getFile(file);
    setPrivateIdFile({
      fileContent: String(fileReader),
      fileName: file.name,
    });
  };

  const handleNumber = (e) => {
    setPhoneNumber(e);
  };

  // UseEffect to toggle payment countries list
  useEffect(() => {
    if (formik.values.allowspecific) {
      setSections((sections) => {
        sections[0].subSections[0].children[11].disabled = false;
        return sections;
      });
    } else {
      setSections((sections) => {
        sections[0].subSections[0].children[11].disabled = true;
        return sections;
      });
      delete formik.values.specificcountry;
    }
  }, [formik?.values?.allowspecific]);

  // To fetch dynamic values for input fileds from api
  const getValue = ({ type, superParent, parent, id }) => {
    if (type === 'file') {
      return privateIdFile?.fileContent;
    }
    if (type === 'phoneNumber') {
      return phoneNumber;
    }
    if (
      superParent &&
      parent &&
      formik.values[superParent] &&
      formik.values[superParent][parent] &&
      formik.values[superParent][parent][id]
    ) {
      return formik.values[superParent][parent][id];
    } else if (parent && formik.values[parent] && formik.values[parent][id]) {
      return formik.values[parent][id];
    } else {
      return formik.values[id];
    }
  };

  // To fetch dynamic names for input fileds
  const getName = ({ type, superParent, parent, id }) => {
    if (superParent && parent && id) {
      return `${superParent}.${parent}.${id}`;
    } else if (parent && id) {
      return `${parent}.${id}`;
    } else {
      return id;
    }
  };

  return (
    <>
      <h1 style={{ fontWeight: '400', marginBottom: '20px' }}>
        Gr4vy Payment Configuration
      </h1>
      {loading ? (
        <div style={{ position: 'absolute', right: '45%', bottom: '50%' }}>
          <LoadingSpinner scale="l">
            <Text.Subheadline as="h4" isBold={true}>
              Loading
            </Text.Subheadline>
          </LoadingSpinner>
        </div>
      ) : null}
      <form onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
        <fieldset
          disabled={loading}
          style={{ opacity: loading ? 0.1 : 1, border: 'none' }}
        >
          <div style={{ marginBottom: '60px' }}>
            {sections &&
              sections.map((section, indexSection) => (
                <CollapsiblePanel
                  key={`section-${indexSection}`}
                  header={section.name}
                  isSticky={true}
                  isDefaultClosed={true}
                >
                  {section?.subSections.map((subSection, indexSubSection) => (
                    <React.Fragment key={`subSection-${indexSubSection}`}>
                      <Text.Subheadline isBold={true} as="h5">
                        {subSection?.name}
                      </Text.Subheadline>
                      <Grid
                        gridGap="20px"
                        gridAutoColumns="1fr"
                        gridTemplateColumns="repeat(2, 1fr)"
                        style={{ width: '100%', margin: '20px' }}
                      >
                        {subSection?.children.map((field, indexField) => (
                          <Grid.Item key={`formik-form-${indexField}`}>
                            <Spacings.Stack scale="s">
                              <Text.Body isBold as="span">
                                {field?.title}
                                {field?.tooltip ? (
                                  <Tooltip
                                    placement="right"
                                    title={field?.tooltip}
                                  >
                                    <InfoIcon
                                      style={{
                                        padding: '2px',
                                        marginTop: '-10px',
                                      }}
                                    />
                                  </Tooltip>
                                ) : null}
                              </Text.Body>

                              {getField({
                                id: getName(field),
                                type: field?.type,
                                title: field?.title,
                                value: getValue(field),
                                name: getName(field),
                                fileName:
                                  field?.id === 'privateKey' &&
                                  privateIdFile?.fileName
                                    ? privateIdFile?.fileName
                                    : '',
                                eventTrigger:
                                  field?.type === 'file'
                                    ? handleFile
                                    : field?.type === 'phoneNumber'
                                    ? handleNumber
                                    : formik.handleChange,
                                options: field?.options,
                                disabled: field?.disabled,
                              })}
                              {field?.id === 'privateKey' &&
                              (formik.values[`${field?.id}`] ||
                                privateIdFile.fileContent) ? (
                                <Spacings.Inline>
                                  <input
                                    type="checkbox"
                                    value={deleteFile}
                                    onChange={(event) => setDeleteFile(true)}
                                  />
                                  <Text.Body>Delete File</Text.Body>
                                </Spacings.Inline>
                              ) : null}
                            </Spacings.Stack>
                          </Grid.Item>
                        ))}
                      </Grid>
                    </React.Fragment>
                  ))}
                </CollapsiblePanel>
              ))}
          </div>
          {(formik.dirty ||
            privateIdFile?.fileContent ||
            deleteFile ||
            phoneNumber) && (
            <div
              style={{
                backgroundColor: '#213c45',
                width: '100%',
                height: '60px',
                padding: '14px',
                borderRadius: '15px 15px 0px 0px',
                position: 'absolute',
                bottom: '0px',
                right: '0px',
              }}
            >
              <Spacings.Inline scale="m" justifyContent="space-between">
                <SecondaryButton
                  label="Cancel"
                  isDisabled={loading}
                  onClick={() => {
                    setPhoneNumber(null);
                    formik.resetForm();
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    borderRadius: '20px',
                    width: '12%',
                    color: 'white',
                    borderColor: 'white',
                    borderStyle: 'solid',
                  }}
                />
                <PrimaryButton
                  label="Submit"
                  isDisabled={loading}
                  type="submit"
                  style={{
                    justifyContent: 'center',
                    borderRadius: '20px',
                    width: '12%',
                  }}
                />
              </Spacings.Inline>
            </div>
          )}
        </fieldset>
      </form>
      <ToastContainer />
      <style>
        {`
        .PhoneInputInput{
          height:36px;
          border-radius:6px;
          border: 1px solid var(--border-color-for-input, hsl(0, 0%, 60%))
        }
        .PhoneInputInput:hover{
          border-color: var(--border-color-for-input-when-focused, #00b39e)
        }
        .PhoneInputInput:focus{
          box-shadow: inset 0 0 0 2px var(--border-color-for-input-when-focused, #00b39e)
        }
        .PhoneInputInput:focus-visible{
          outline: none;
        }
        `}
      </style>
    </>
  );
};

Gr4vy.displayName = 'Gr4vy';
Gr4vy.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default Gr4vy;
