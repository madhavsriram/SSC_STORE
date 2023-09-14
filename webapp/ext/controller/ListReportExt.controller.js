sap.ui.controller("createstorecr.ext.controller.ListReportExt", {
    onInit: function () {
        if (sap.ui.Device.system.phone == true) {
            this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--template::ListReport::TableToolbar").addStyleClass("TextWrap");
        }
        var i18nModel = new sap.ui.model.resource.ResourceModel({

            bundleName: "createstorecr.i18n.i18n"
        });

        this.getView().setModel(i18nModel, "i18n");
        sap.ui
            .getCore()
            .getConfiguration()
            .getFormatSettings()
            .setLegacyDateFormat(3);
        this._checkIsStoreAssigned();
        this.fileUploaded = [];
        this.oAttachmentUplListlistlist = sap.ui.getCore().byId("CustomUpload");
        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--template::Share").setVisible(false);
        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--addEntry").setVisible(false);
        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--deleteEntry").setVisible(false);
        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--listReport").setSmartVariant();
        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--listReportFilter").setPersistencyKey(true);
        

    },
    _checkIsStoreAssigned: function () {
        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        oModel.read("/StoreHeader", {
            success: function (oData, response) {
                var storeHeaderText =
                    "Store Number :" +
                    " " +
                    oData.results[0].StoreId +
                    "\n" +
                    oData.results[0].AddressLine_1 +
                    ((oData.results[0].AddressLine_2 !== '') ? ", " : "")
                    +
                    oData.results[0].AddressLine_2 +
                    "\n" +
                    oData.results[0].City +
                    ", " +
                    oData.results[0].State +
                    ", " +
                    oData.results[0].ZipCode +
                    ", " +
                    oData.results[0].Country +
                    "\n" +
                    "SCC ID :" +
                    " " +
                    oData.results[0].SCCName;
                var assignStoreModel = new sap.ui.model.json.JSONModel({
                    pageTitle: storeHeaderText,
                });
                that.getView().setModel(assignStoreModel, "assignStoreModel");
                that.storeid = oData.results[0].StoreId;


                that.IntSCCId = oData.results[0].IntSCCId;

                that.IntStoreId = oData.results[0].IntStoreId;
                that
                    .getView()
                    .byId(
                        "createstorecr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--template:::ListReportPage:::DynamicPageTitle"
                    )
                    .getHeading()
                    .setProperty("wrapping", true);

            },
            error: function (oError) {
                var Msg = this.getView().getModel("i18n").getResourceBundle();
                sap.m.MessageBox.alert(Msg.getText("TechincalErrorStoreHeader"));
            },
        });
    },

    onBeforeRebindTableExtension: function (oEvent) {
        this._table = oEvent.getSource().getTable();
        this._table.setMultiSelectMode().mProperties.mode="SingleSelectNone";
    },
    handleLiveChange: function (oEvent) {
        var character = oEvent.getSource();
        var cnt = 500 - character.getValue().length;
        oEvent.getSource().getParent().getContent()[3].getItems()[0].setText(cnt + " "+this.getView().getModel("i18n").getResourceBundle().getText("CharactersRemaining"))

    },
    onCreateWithoutInvoice: function () {
        if (!this._createWithoutInvoiceDialog) {
            this._createWithoutInvoiceDialog = sap.ui.xmlfragment(
                "createstorecr.ext.fragments.CreateWithoutInvoice",
                this
            );
            this.getView().addDependent(this._createWithoutInvoiceDialog);
        }
        this._createWithoutInvoiceDialog.open();
    },

    onClosePressed: function () {
        this.fileUploaded = [];
        this._createWithoutInvoiceDialog.close();
        this._itemDialogDestroy();
    },

    _itemDialogDestroy() {
        sap.ui.getCore().byId("Remark").mProperties.value = "";
        sap.ui.getCore().byId("lbl1").setText(this.getView().getModel("i18n").getResourceBundle().getText("500CharactersAllowed"));

        sap.ui.getCore().byId("CustomUpload").destroyItems();
        this.fileUploaded = [];
    },

    onAfterItemAdded: function (oEvent) {
        var item = oEvent.getParameter("item");
        this._createEntity(item);
    },

    _createEntity: function (item) {
        var data = {
            MediaType: item.getMediaType(),
            FileName: item.getFileName(),
            Size: item.getFileObject().size,
        };
        var that = this;
        this.getView()
            .getModel()
            .create("/AttachmentRow", data, {
                method: "POST",
                success: function (data) {
                    that._uploadContent(item, data);
                },
                error: function (data) {
                    var Msg1 = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.error(Msg1.getText("Error"));
                },
            });
    },

    onUploadCompleted: function (oEvent) {
        oAttachmentUplListlist.removeAllIncompleteItems();
    },

    _uploadContent: function (item, result) {
        var Url = result.__metadata.media_src.replaceAll("'", "");
        Url = Url.replace("$value", "Content");
        Url = Url.replace("guid", "");
        item.setUploadUrl(Url);
        item.setUrl(Url);
        oAttachmentUplListlist.setHttpRequestMethod("PUT");
        oAttachmentUplListlist.uploadItem(item);
        var data = {
            id: result.Id,
            MediaType: item.getMediaType(),
            FileName: item.getFileName(),
            Size: item.getFileObject().size,
        };
        this.fileUploaded.push(data);
    },

    // ###### Upload Items
    onBeforeItemAdded: function (oEvent) {
        oAttachmentUplListlist = sap.ui.getCore().byId(oEvent.getParameter("id"));
        var oItem = oEvent.getParameter("item");
        oItem.setVisibleEdit(false);
        var Data = oAttachmentUplListlist.getModel().getData();
        //   if (Data !== null) {
        //     var fileIndex = Data.results.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
        //   if (this.fileUploaded.length > 0) {
        //     fileIndex = this.fileUploaded.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
    },

    onRemoveItem: function (evt) {
        var oItem = evt.getParameter("item");
        var oCalledEvent = sap.ui.getCore().byId(evt.getParameter("id")).sId;
        var Data = sap.ui
            .getCore()
            .byId(evt.getParameter("id"))
            .getModel()
            .getData();
        if (Data !== null) {
            //Do nothing
        } else {
            sap.ui.getCore().byId(evt.getParameter("id")).removeItem(oItem);
            var fileIndex = this.fileUploaded.findIndex(
                (x) => x.FileName === oItem.getFileName()
            );
            this.fileUploaded.splice(fileIndex, 1);
        }
    },

    onSubmitPressed: function () {
        var that = this;
        var SUBMsg = this.getView().getModel("i18n").getResourceBundle();

        // var remark = sap.ui.getCore().byId("Remark").mProperties.value;
        var remark = sap.ui.getCore().byId("Remark").getValue();
        if (remark === "" || this.fileUploaded.length === 0) {
            sap.m.MessageBox.error(SUBMsg.getText("PleaseRequiredBeforeSaving"));
        } else {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "yyyy-MM-dd" + "T" + "HH:mm:ss" + "Z"

            });

            var DateTime = oDateFormat.format(new Date());
            var lPSInvoiceStoreId = this.storeid.toString();

            var lIntStoreId = this.IntStoreId.toString();

            var lIntSCCId = this.IntSCCId.toString();
            var obj = {
                SubmissionDateTime: DateTime,
                OrgStrucEleCode_Id: 1,
                CRDocDate: new Date(),
                PSInvoiceHdr_PsplInvoice: null,
                ChangedDateTime: new Date(),
                CreatedDateTime: new Date(),
                StatusCode_Id: 2,
                StatusCode_ObjectType_Id: 1,
                Remark: remark,
                OrgStrucEleCode_Id: 1,
                PSInvoiceStoreId: lPSInvoiceStoreId,
                SCC_Id: lIntSCCId,
                Store_Id: lIntStoreId,
                CreditReqItem: [
                    {
                        Material: "9998",
                        Description: "Without Invoice",
                        StatusCode_Id: 1,
                        StatusCode_ObjectType_Id: 1,
                        Attachment: [
                            {
                                CRType_Id: 6,
                                CreatedOn: new Date(),
                            },
                        ],
                    },
                ],
            };
            this.oModel = this.getView().getModel();
            this.oModel.create("/CreditReqHdr", obj, {
                method: "POST",
                success: function (data) {
                    CRNo = data.BTPCRNO;
                    if (data.CreditReqItem.results[0].Attachment.results.length > 0) {
                        that.updateAttachmentID(
                            data.CreditReqItem.results[0].Attachment.results[0].AttachmentId
                        );
                    }
                    sap.m.MessageBox.success(SUBMsg.getText("CreditRequest") + " " + data.BTPCRNO + " " + SUBMsg.getText("CreatedSubmittedSuccessfully"),
                        {
                            actions: [sap.m.MessageBox.Action.OK],

                            onClose: function (sAction) {
                                //  MessageToast.show("Action selected: " + sAction);
                            },
                        }
                    );
                    that.fileUploaded = [];
                    that._createWithoutInvoiceDialog.close();
                    that._itemDialogDestroy();
                },
                error: function (e) {
                    sap.m.MessageBox.error(SUBMsg.getText("Error"));
                },
            });
        }
    },

    onSavePressed: function () {
        var SAVEMsg = this.getView().getModel("i18n").getResourceBundle();

        var that = this;
        // var remark = sap.ui.getCore().byId("Remark").mProperties.value;
        var remark = sap.ui.getCore().byId("Remark").getValue();
        if (remark === "" || this.fileUploaded.length === 0) {
            sap.m.MessageBox.error(SAVEMsg.getText("PleaseRequiredBeforeSaving"));
        } else {
            var lPSInvoiceStoreId = this.storeid.toString();
            var lIntStoreId = this.IntStoreId.toString();

            var lIntSCCId = this.IntSCCId.toString();
            var obj = {
                OrgStrucEleCode_Id: 1,
                CRDocDate: new Date(),
                PSInvoiceHdr_PsplInvoice: null,
                ChangedDateTime: new Date(),
                CreatedDateTime: new Date(),
                StatusCode_Id: 5,
                StatusCode_ObjectType_Id: 1,
                Remark: remark,
                OrgStrucEleCode_Id: 1,
                PSInvoiceStoreId: lPSInvoiceStoreId,
                SCC_Id: lIntSCCId,
                Store_Id: lIntStoreId,
                CreditReqItem: [
                    {
                        Material: "9998",
                        Description: "Without Invoice",
                        StatusCode_Id: 1,
                        StatusCode_ObjectType_Id: 1,
                        Attachment: [
                            {
                                CRType_Id: 6,
                                CreatedOn: new Date(),
                            },
                        ],
                    },
                ],
            };
            this.oModel = this.getView().getModel();
            this.oModel.create("/CreditReqHdr", obj, {
                method: "POST",
                success: function (data) {
                    CRNo = data.BTPCRNO;
                    if (data.CreditReqItem.results[0].Attachment.results.length > 0) {
                        that.updateAttachmentID(
                            data.CreditReqItem.results[0].Attachment.results[0].AttachmentId
                        );
                    }
                    sap.m.MessageBox.success(SAVEMsg.getText("CreditRequest") + " " + data.BTPCRNO + " " + SAVEMsg.getText("CreatedSuccessfully"),
                        {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (sAction) {
                                //  MessageToast.show("Action selected: " + sAction);s
                            },
                        }
                    );
                    that.fileUploaded = [];
                    that._createWithoutInvoiceDialog.close();
                    that._itemDialogDestroy();
                },
                error: function (e) {
                    sap.m.MessageBox.error(SAVEMsg.getText("Error"));
                },
            });
        }
    },

    updateAttachmentID: function (attachmentID) {
        this.oModel.setUseBatch(true);
        for (var i = 0; i < this.fileUploaded.length; i++) {
            var sPath = "/AttachmentRow(" + this.fileUploaded[i].id + ")";
            var obj = {
                AttachmentID_AttachmentId: attachmentID,
            };
            this.oModel.update(sPath, obj, {
                success: function (oData) { },
                error: function (Error) {
                    var errorMsg = JSON.parse(Error.responseText).error.message.value;
                    sap.m.MessageBox.error(errorMsg);
                },
            });
        }
    },

    onPressCRlist: function (oEvt) {
        this.InvoiceNo = oEvt
            .getSource()
            .getBindingContext()
            .getObject().PsplInvoice;

        if (!this._ListNoofCRsDialog) {
            this._ListNoofCRsDialog = sap.ui.xmlfragment(
                "createstorecr.ext.fragments.ListNoofCR",
                this
            );
            this.getView().addDependent(this._ListNoofCRsDialog);

        }
        var SelectedInvNo = this.getView().getModel("i18n").getResourceBundle();

        this._ListNoofCRsDialog.open();
        var sDialog = sap.ui.getCore().byId("NoofCRPopup");
        sDialog.setTitle(SelectedInvNo.getText("SelectedInvoiceNo") + " " + this.InvoiceNo);
    },

    onNooFCRClose: function () {
        this._ListNoofCRsDialog.close();
    },

    onNoofCRNavigate: function (oEvent) {
        var that = this;
        if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
            // var oCrossAppNav = sap.ushell.Container.getService(
            //   "CrossApplicationNavigation"
            // );
            // oCrossAppNav.toExternal({
            //   target: { semanticObject: "storecrmanagement", action: "manage" },
            //   params: { PsplInvoice: [this.InvoiceNo] },
            // });
            var oCrossAppNav = sap.ushell.Container.getServiceAsync(
                "CrossApplicationNavigation"
            );
            oCrossAppNav.then(function (obj) {
                obj.toExternal({
                    target: { semanticObject: "storecrmanagement", action: "manage" },
                    params: { PsplInvoice: [that.InvoiceNo] },
                });
            })
        }
    },
});
