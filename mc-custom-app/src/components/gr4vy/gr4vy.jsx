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
import initialValues from './initValues.json';
import axios from 'axios';
import config from './gr4vy.config.json';
import 'react-toastify/dist/ReactToastify.css';

const Gr4vy = () => {
  const [sections, setSections] = useState(formSections);
  let [loading, setLoading] = useState(false);
  const dispatch = useAsyncDispatch();
  const [privateIdFile, setPrivateIdFile] = useState({});
  const [deleteFile, setDeleteFile] = useState(false);
  const [apiResponse, setApiResponse] = useState({});

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
        setApiResponse({ ...CustObj?.value, information: config.VERSION });
        setPrivateIdFile({ filePath: CustObj?.value?.privateKey });
      } else {
        setApiResponse({ ...initialValues, information: config.VERSION });
        setPrivateIdFile({ filePath: initialValues?.privateKey });
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
      } else if (privateIdFile?.filePath) {
        values = { ...values, privateKey: privateIdFile.filePath };
      }
      saveCustomObject({
        ...values,
      });
    },
    enableReinitialize: true,
  });

  // Function to handle file upload to REST server
  const handleFile = async (e) => {
    const file = e?.target?.files[0];
    const formData = new FormData();
    formData.append('file', file, e?.target?.value);
    try {
      let axiosConfig = {
        method: 'post',
        url: `${config.API_SERVER_URL}/key/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      axios(axiosConfig)
        .then(function ({ data }) {
          setPrivateIdFile({ filePath: data.result.newPath });
          toast('File saved successfully', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: false,
            theme: 'light',
            type: 'success',
          });
        })
        .catch(function (error) {
          console.log(error);
          toast('Failed to save file', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: false,
            theme: 'light',
            type: 'error',
          });
        });
    } catch (error) {}
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
      return privateIdFile?.filePath;
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
                                eventTrigger:
                                  field?.type === 'file'
                                    ? handleFile
                                    : formik.handleChange,
                                options: field?.options,
                                disabled: field?.disabled,
                              })}
                              {field?.id === 'privateKey' &&
                              (formik.values[`${field?.id}`] ||
                                privateIdFile.filePath) ? (
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
          {(formik.dirty || privateIdFile?.filePath || deleteFile) && (
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
                  onClick={() => formik.resetForm()}
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
    </>
  );
};

Gr4vy.displayName = 'Gr4vy';
Gr4vy.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default Gr4vy;
