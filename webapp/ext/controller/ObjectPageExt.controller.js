sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/ValueState",
        "sap/m/Dialog",
        "sap/m/DialogType",
        "sap/m/Button",
        "sap/m/ButtonType",
        "sap/m/Text",
        "sap/ui/core/routing/History",
        "createstorecr/ext/model/formatter",
    ],
    function (
        JSONModel,
        Filter,
        FilterOperator,
        ValueState,
        Dialog,
        DialogType,
        Button,
        ButtonType,
        Text,
        History,
        formatter
    ) {
        "use strict";
        var pressDialog;
        var damage;
        var mediaType;
        var fileName;
        var size;
        var data;
        var removedFileDamage = [];
        var removedFileQuality = [];
        var removedFileShortage = [];
        var CRNo;
        var path = {};
        var crqty;
        var critm;
        var arr = [];
        var Item = [];
        var uploadedFileDamage = [];
        var uploadedFileQuality = [];
        var uploadedFileShortage = [];
        var oAttachmentsModel, oAttachmentsModel1, oAttachmentsModel2, invoicedata;
        var gMaterial,
            selProduct,
            itemdata,
            deleteID,
            submitID,
            bTPCRItem,
            attachmentPIssue,
            icondata,
            Attachmentid,
            oAttachmentUpl,
            oAttachmentUpl1,
            oAttachmentUpl2,
            CRopenqty,
            crItemCount,
            sTotalOpenQty,
            id;
        return {
            formatter: formatter,
            onInit: function () {
                var i18nModel = new sap.ui.model.resource.ResourceModel({ 

                    bundleName : "createstorecr.i18n.i18n" }); 
        
                    this.getView().setModel(i18nModel,"i18n"); 
    
                  
                this.extensionAPI.attachPageDataLoaded(
                    function (oEvent) {

                        CRNo = this.getView().byId(
                            "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                        ).mProperties.value;
                        this.getView()
                            .byId(
                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::Table"
                            )
                            .setUseExportToExcel();
                        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--template::Share").setVisible(false);
                        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--edit").setVisible(false);
                        this.getView().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--delete").setVisible(false);
                        var that = this;
                        var oModel = this.getOwnerComponent().getModel();
                        var PsId = this.getView().byId(
                            "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::SCCDesc::Field"
                        ).mProperties.value;
                        var oFilterR = new sap.ui.model.Filter({
                            filters: [new sap.ui.model.Filter("PsId", "EQ", PsId)],
                        });
                        oModel.read("/SCCRegion", {
                            filters: [oFilterR],
                            success: function (oResponse) {
                                if (oResponse.results.length > 0) {
                                    that.SCCID = oResponse.results[0].Id;
                                    that.RegionIdID = oResponse.results[0].RegionId;
                                }
                            },
                            error: function (err) { },
                        });
                        if (CRNo != undefined) {
                            oFilterR = [];
                            var rowIDData = new Filter("RowId", FilterOperator.EQ, 0);
                            var cRNoData = new Filter(
                                "CRNO_BTPCRNO",
                                FilterOperator.EQ,
                                CRNo
                            );
                            oFilterR.push(rowIDData, cRNoData);
                            var path = "/CRCommit?$count";
                            var that = this;
                            oModel.read(path, {
                                filters: oFilterR,
                                success: function (oData) {
                                    if (oData.results.length > 0) {
                                        sap.ui
                                            .getCore()
                                            .byId(
                                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                                            )
                                            .setType("Emphasized");
                                    } else {
                                        sap.ui
                                            .getCore()
                                            .byId(
                                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                                            )
                                            .setType("Default");
                                    }
                                },
                                error: function (error) { },
                            });
                        } else {
                            sap.ui
                                .getCore()
                                .byId(
                                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                                )
                                .setType("Default");
                        }
                    }.bind(this)
                    
                );
                // The below function will get called for every binding change
                oAttachmentsModel = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().setModel(
                    oAttachmentsModel,
                    "oAttachmentsModel"
                );
                oAttachmentsModel1 = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().setModel(
                    oAttachmentsModel1,
                    "oAttachmentsModel1"
                );
                oAttachmentsModel2 = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().setModel(
                    oAttachmentsModel2,
                    "oAttachmentsModel2"
                );
                // oAttachmentsModel = new sap.ui.model.json.JSONModel();

                this.extensionAPI.attachPageDataLoaded(
                    function (oEvent) {
                        //  this._read();
                    }.bind(this)
                );
                var productIssueModel = new JSONModel();
                this.getOwnerComponent().setModel(
                    productIssueModel,
                    "productIssueModel"
                );
                var headerCommentsModel = new JSONModel();
                this.getOwnerComponent().setModel(
                    headerCommentsModel,
                    "headerCommentsModel"
                );
                var itemCommentsModel = new JSONModel();
                this.getOwnerComponent().setModel(
                    itemCommentsModel,
                    "itemCommentsModel"
                );
                var data = {
                    ProductName: "",
                    ProductIssue: [],
                    UseByDate: null,
                    JulianDate: null,
                    QLotCode: "",
                    ManufactureDate: null,
                    ExpirationDate: null,
                    BestBeforeDate: null,
                };
                var qualityModel = new JSONModel(data);
                this.getOwnerComponent().setModel(qualityModel, "qualityModel");

                var data = {
                    crNo: "",
                };
                var uniModel = new JSONModel(data);
                this.getOwnerComponent().setModel(uniModel, "uniModel");

                this.getOwnerComponent()
                    .getRouter()
                    .attachRouteMatched(this._onRouteMatched, this);
                this.extensionAPI.attachPageDataLoaded(
                    function (oEvent) {
                        //  this._read();
                        var invoicepath = oEvent.context.sPath;
                        invoicedata = this.getView().getModel().getProperty(invoicepath);
                    }.bind(this)
                );
                // this.getView().byId('createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::Table')._oTable.getColumns()[0].setDemandPopin(true);
                // this.getView().byId('createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::Table')._oTable.getColumns()[1].setDemandPopin(false); 
                // this.getView().byId('createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::Table')._oTable.getColumns()[4].setDemandPopin(true);         
            },

            _onRouteMatched: function (oEvent) {
                if (oEvent.getParameter("name") === "PSInvoiceHdrquery") {
                    this.itemComments = "";
                    this.headComments = "";
                }
            },

            onHeaderCommentPost: function (evt) {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                var oDataModel = this.getView().getModel(),
                    Path = "/CRCommit",
                    //   commentText = evt.getSource().getValue(),
                    commentText = sap.ui.getCore().byId("idHeaderCTA").getValue(),
                    that = this,
                    obj = {
                        //  Id: Math.floor(Math.random() * (999 - 100 + 1) + 100),
                        CRNO_BTPCRNO: CRNo,
                        CRNO_OrgStrucEleCode_Id: 1,
                        RowId: 0,
                        Comment: commentText,
                    };
                oDataModel.create(Path, obj, {
                    method: "POST",
                    success: function (oData) {
                        sap.ui
                            .getCore()
                            .byId(
                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                            )
                            .setType("Emphasized");
                        sap.ui.getCore().byId("idHeaderCTA").setValue("");
                        that
                            .getOwnerComponent()
                            .getModel("headerCommentsModel")
                            .updateBindings(true);
                        that.getOwnerComponent().getModel("headerCommentsModel").refresh();
                        that.openHeaderComments();
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },

            openHeaderComments: function (evt) {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                if (CRNo === undefined || CRNo === null) {
                    var CmtS = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageToast.show(CmtS.getText("CRNumberNotCreated")); 
                                 } else {
                    var oDataModel = this.getView().getModel(),
                        uFilters = [];
                    var rowIDData = new Filter("RowId", FilterOperator.EQ, 0);
                    var cRNoData = new Filter("CRNO_BTPCRNO", FilterOperator.EQ, CRNo);
                    uFilters.push(rowIDData, cRNoData);
                    var path = "/CRCommit";
                    var that = this;
                    oDataModel.read(path, {
                        filters: uFilters,
                        success: function (oData) {
                            that
                                .getOwnerComponent()
                                .getModel("headerCommentsModel")
                                .setProperty("/", oData);
                            that.openHeaderDialog();
                            var saveButtonId = sap.ui.getCore().byId("sendHeader");
                            saveButtonId.setEnabled(false);
                        },
                        error: function (error) { },
                    });
                }
            },

            onHeaderCommentsClose: function () {
                this._headerCommentsDialog.close();
            },

            openHeaderDialog: function () {
                if (!this._headerCommentsDialog) {
                    this._headerCommentsDialog = sap.ui.xmlfragment(
                        "createstorecr.ext.fragments.HeaderComments",
                        this
                    );

                    this.getView().addDependent(this._headerCommentsDialog);
                }
                this._headerCommentsDialog.open();
            },

            liveChangeHeader: function (evt) {
                var enteredText = evt.getParameter("value");
                var saveButtonId = sap.ui.getCore().byId("sendHeader");
                if (enteredText === "") {
                    saveButtonId.setEnabled(false);
                } else {
                    saveButtonId.setEnabled(true);
                }
            },

            openItemComments: function (evt) {
                if (evt !== undefined) {
                    if (evt.getSource().getBindingContext().getObject().ItemNo === "DC" ||
                        evt.getSource().getBindingContext().getObject().ItemNo === "CDF") {
                        return;
                    }
                    if (
                        evt.getSource().getBindingContext().getObject().CRQty ===
                        undefined ||
                        evt.getSource().getBindingContext().getObject().CRQty === "" ||
                        evt.getSource().getBindingContext().getObject().CRQty === null
                    ) {
                        var Cmt2 = this.getView().getModel("i18n").getResourceBundle();
                        sap.m.MessageToast.show(Cmt2.getText("CRNumberNotCreated"));  
                                             return;
                    }
                    var material = evt.getSource().getBindingContext().getObject().ItemNo;
                } else {
                    var material = gMaterial;
                }
                gMaterial = material;
                var oDataModel = this.getView().getModel();
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                var BTCRNO = new sap.ui.model.Filter({
                    path: "BTPCRNo_BTPCRNO",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: CRNo,
                });
                var Description = new sap.ui.model.Filter({
                    path: "Material",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: material,
                });
                var StatusCode = new sap.ui.model.Filter({
                    path: "StatusCode_Id",
                    operator: sap.ui.model.FilterOperator.NE,
                    value1: 10,
                });
                var oFilter = new Array();
                oFilter.push(BTCRNO);
                oFilter.push(Description);
                oFilter.push(StatusCode);

                var path = "/CreditReqItem";
                var that = this;
                oDataModel.read(path, {
                    filters: oFilter,
                    urlParameters: {
                        $expand: "CRCommit",
                    },
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            that
                                .getOwnerComponent()
                                .getModel("itemCommentsModel")
                                .setProperty("/", oData.results[0].CRCommit);
                        } else {
                            that
                                .getOwnerComponent()
                                .getModel("itemCommentsModel")
                                .setProperty("/");
                        }
                        that.CreditReqItem_BTPCRItem = oData.results[0].BTPCRItem;
                        that.openItemCommentPopup();
                    },
                    error: function (error) { },
                });
            },

            // Posting Item Comments
            onItemsCommentPost: function (evt) {
                var material = gMaterial;
                var oDataModel = this.getView().getModel();
                var Path = "/CRCommit",
                    commentText = sap.ui.getCore().byId("idItemCTA").getValue(),
                    that = this,
                    obj = {
                        CRNO_BTPCRNO: CRNo,
                        CRNO_OrgStrucEleCode_Id: 1,
                        Material: material,
                        Comment: commentText,
                        CreditReqItem_BTPCRItem: that.CreditReqItem_BTPCRItem,
                    };
                oDataModel.create(Path, obj, {
                    method: "POST",
                    success: function (oData) {
                        sap.ui.getCore().byId("idItemCTA").setValue("");
                        that
                            .getOwnerComponent()
                            .getModel("itemCommentsModel")
                            .updateBindings(true);
                        that.getOwnerComponent().getModel("itemCommentsModel").refresh();
                        that.extensionAPI.refresh();
                        that.openItemComments();
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },

            onItemsCommentsClose: function () {
                this._itemCommentsDialog.close();
            },

            liveChangeItem: function (evt) {
                var enteredText = evt.getParameter("value");
                var saveButtonId = sap.ui.getCore().byId("sendItem");
                if (enteredText === "") {
                    saveButtonId.setEnabled(false);
                } else {
                    saveButtonId.setEnabled(true);
                }
            },

            onSubmit: function (oEvent) {
                this._itemCRCount();
            },

            onWarningSubmitPress: function () {
                var that=this;
                var Yes= that.getView().getModel("i18n").getResourceBundle();
              if (!this.oWarningSubmitDialog) {
                this.oWarningSubmitDialog = new Dialog({
                  type: DialogType.Message,
                  title: Yes.getText("Warning"),
                  state: ValueState.Warning,
                  content: new Text({ text: Yes.getText("Douwantsubmit")}),
                  beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: Yes.getText("Yes"),
                    press: function () {
                      this.oWarningSubmitDialog.close();
                      this._finalSubmit();
                    }.bind(this),
                  }),
                  endButton: new Button({
                    type: ButtonType.Default,
                    text: Yes.getText("No"),
                    press: function () {
                      this.oWarningSubmitDialog.close();
                    }.bind(this),
                  }),
                });
              }
      
              this.oWarningSubmitDialog.open();
            },

//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Modification of Submission Date Time format
//==================================

            _finalSubmit: function () {
                // var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                //     pattern: "yyyy-MM-dd" + "T" + "HH:mm:ss" + "Z"

                // });

                // var DateTime = oDateFormat.format(new Date());
                var oDataModel = this.getView().getModel(),
                    Path = "/CreditReqHdr(BTPCRNO=" + CRNo + ",OrgStrucEleCode_Id=1)",
                    that = this,
                    // obj = {
                    //     StatusCode_Id: 2,
                    //     SubmissionDateTime: DateTime
                    // };
                    obj = {
                        StatusCode_Id: 2,
                        SubmissionDateTime: new Date()
                    };
                oDataModel.update(Path, obj, {
                    success: function (oData) {
                        that.extensionAPI.refresh();
                        var FinalMsg1= that.getView().getModel("i18n").getResourceBundle().aPropertyFiles[0].mProperties.CreditRequest;
                        var FinalMsg2=  that.getView().getModel("i18n").getResourceBundle().aPropertyFiles[0].mProperties.SubmittedSuccessfully;
                        sap.m.MessageBox.success( FinalMsg1 +" "+ CRNo +" "+ FinalMsg2,
                    {
                         actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (sAction) {
                                    //  MessageToast.show("Action selected: " + sAction);
                                    if (sAction == "OK") {
                                        window.history.go(-1);
                                    }
                                },
                            }
                        );
                        that
                            .getView()
                            .byId(
                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton"
                            )
                            .setEnabled(false);
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },
    // =========== Beging of changes done by Bala on 21st Aug 2023
            onBeforeRebindTableExtension: function (oEvent) {
                this._table = oEvent.getSource().getTable();
                oEvent.getSource().getTable().setAutoPopinMode(false);
                var oTab = oEvent.getSource().getTable().mAggregations.columns;
                var oIndex1 = this._table.getColumns()[0].getIndex() ;
                var oIndex2 = this._table.getColumns()[4].getIndex() ;
                // this._table.getColumns()[0].setIndex(oIndex2);
                // this._table.getColumns()[4].setIndex(oIndex2);
                // oTab[0].setInitialOrder(4);
                // oTab[4].setInitialOrder(0);
                for (let index = 0; index < oTab.length; index++) {
                    if (oTab[index].getId().includes("ItemNo") || oTab[index].getId().includes("textColumn1")) {
                        oTab[index].setDemandPopin(true);
                        oTab[index].setMinScreenWidth('');
                    } else {
                        oTab[index].setDemandPopin(true);
                        oTab[index].setMinScreenWidth('tablet');
                    }   
                }

            },
        // =========== End of changes done by Bala on 21st Aug 2023    
            onWarningDeletePress: function () {
                var cr_qty = sap.ui.getCore().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable").getSelectedItem().getBindingContext().getObject().CRQty;

                var cr_type = sap.ui.getCore().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable").getSelectedItem()
                    .getBindingContext().getObject().CRTypeDesc;

                if (cr_qty == null || cr_type == null) {

                    var WarningMsg = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.warning(WarningMsg.getText("NoCRavailabledeletion"));  
                    this._table.removeSelections();
                    this.getView().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--REPLACE_WITH_ACTION_IDButton").setEnabled(false);

                    return;

                }
                if (!this.oWarningMessageDialog) {
                    //         var cr_qty=sap.ui.getCore().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable").getSelectedItem().getBindingContext().getObject().CRQty;

                    //         var cr_type=sap.ui.getCore().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable").getSelectedItem()
                    //    .getBindingContext().getObject().CRTypeDesc;

                    //         if(cr_qty==null || cr_type==null){

                    //                     sap.m.MessageBox.warning("No CR data available for deletion");  
                    //                     this._table.removeSelections();
                    //                     this.getView().byId("createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--REPLACE_WITH_ACTION_IDButton").setEnabled(false);

                    //                 return;

                    //         }
                    var that=this;

                    var wrningDel = that.getView().getModel("i18n").getResourceBundle();
        
                    this.oWarningMessageDialog = new Dialog({  
        
                      type: DialogType.Message,
        
                      title: wrningDel.getText("Warning"),
        
                      state: ValueState.Warning,
        
                      content: new Text({  
        
                        text: wrningDel.getText("Doyouwanttodelete"),
        
                      }),
        
                      beginButton: new Button({
        
                        type: ButtonType.Emphasized,
        
                        text: wrningDel.getText("Yes"),
        
                        press: function () {
        
                          this.oWarningMessageDialog.close();
        
                          this.onDelete(); 
        
                        }.bind(this),
        
                      }),
        
                      endButton: new Button({
        
                        type: ButtonType.Default,
        
                        text: wrningDel.getText("No"),
        
                        press: function () {
        
                          this.oWarningMessageDialog.close();
        
                        }.bind(this),
                        }),
                    });
                }

                this.oWarningMessageDialog.open();
            },

            _itemCRCount: function () {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;

                var oDataModel = this.getView().getModel(),
                    Path = "/CreditReqItem";
                var uFilters = [];
                var BTPCRNo_BTPCRNOData = new Filter(
                    "BTPCRNo_BTPCRNO",
                    FilterOperator.EQ,
                    CRNo
                );
                var StatusCodeData = new Filter("StatusCode_Id", FilterOperator.NE, 10);
                uFilters.push(BTPCRNo_BTPCRNOData, StatusCodeData);
                var that = this;
                oDataModel.read(Path, {
                    filters: uFilters,
                    success: function (oData) {
                        crItemCount = oData.results;
                        CRNo = that
                            .getView()
                            .byId(
                                "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                            ).mProperties.value;
                        if (CRNo === undefined || CRNo === null) {
                            that.Cmt3 = that.getView().getModel("i18n").getResourceBundle();
                that.cmt=that.Cmt3.getText("CRNumberNotCreated");
                sap.m.MessageToast.show(that.cmt);
              } else { 
                if (crItemCount.length > 0) {
                  that.onWarningSubmitPress();
                } else {
                    var Cmt4 = this.getView().getModel("i18n").getResourceBundle();
                  sap.m.MessageBox.warning(Cmt4.getText("NoItemsCR"));
                }
              }
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },

            onDelete: function () {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                var item = sap.ui
                    .getCore()
                    .byId(
                        "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
                    )
                    .getSelectedItem()
                    .getBindingContext()
                    .getObject().ItemNo;

                var oDataModel = this.getView().getModel(),
                    Path = "/CreditReqItem";
                var uFilters = [];
                var BTPCRNo_BTPCRNOData = new Filter(
                    "BTPCRNo_BTPCRNO",
                    FilterOperator.EQ,
                    CRNo
                );
                var materialData = new Filter("Material", FilterOperator.EQ, item);
                uFilters.push(BTPCRNo_BTPCRNOData, materialData);
                var that = this;
                oDataModel.read(Path, {
                    filters: uFilters,
                    success: function (oData) {
                        bTPCRItem = oData.results[0].BTPCRItem;
                        that._crStatusDelete();
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },

            _crStatusDelete: function () {
                var masters = this.getView().getModel(),
                    that = this,
                    del = "Del",
                    uFilters = [];
                var delState = new Filter("StatusType", FilterOperator.EQ, del);
                uFilters.push(delState);
                var path = "/CRStatus";
                masters.read(path, {
                    filters: uFilters,
                    success: function (oData) {
                        deleteID = oData.results[0].Id;
                        that._deleteBTPCRItem();
                    },
                    error: function (error) { },
                });
            },

            _deleteBTPCRItem: function () {
                var oDataModel = this.getView().getModel(),
                    Path = "/CreditReqItem" + "(" + bTPCRItem + ")";
                var that = this,
                    obj = {
                        StatusCode_Id: 10,
                    };
                oDataModel.update(Path, obj, {
                    success: function (oData) {
                        that.extensionAPI.refresh();
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },

            openItemCommentPopup: function () {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                if (CRNo === undefined || CRNo === null) {
                    sap.m.MessageToast.show("Credit Request Number Has Not Been created");
                } else {
                    if (!this._itemCommentsDialog) {
                        this._itemCommentsDialog = sap.ui.xmlfragment(
                            "createstorecr.ext.fragments.ItemComments",
                            this
                        );
                        this.getView().addDependent(this._itemCommentsDialog);
                    }
                    this._itemCommentsDialog.open();
                    var saveButtonId = sap.ui.getCore().byId("sendItem");
                    saveButtonId.setEnabled(false);
                }
            },

            onAddIcon: function (oEvent) {
                if (oEvent.getSource().getBindingContext().getObject().ItemNo === "DC" ||
                    oEvent.getSource().getBindingContext().getObject().ItemNo === "CDF") {
                    return;
                }
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                var PsplInvoice = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::PsplInvoice::Field"
                ).mProperties.value;
                var itemMat = oEvent.getSource().getBindingContext().getObject().ItemNo;
                var that = this;
                that.item = itemMat;
                this.spath = oEvent.getSource().getParent().getBindingContextPath();
                this.oModel = this.getView().getModel();
                var sQty = oEvent.getSource().getBindingContext().getObject().CRQty;
                var sOpenQty = oEvent.getSource().getBindingContext().getObject()
                    .OpenQty;
                sTotalOpenQty = sQty + sOpenQty;

                var creditQty = this.getView().getModel().getProperty(this.spath).CRQty;
                if (creditQty == 0 || creditQty == "" || creditQty == undefined) {
                    var itemFilters = [];
                    var PsplInvoiceData = new Filter(
                        "PsplInvoice",
                        FilterOperator.EQ,
                        PsplInvoice
                    );
                    var matData = new Filter("Material", FilterOperator.EQ, itemMat);

                    itemFilters.push(PsplInvoiceData, matData);
                    this.oModel.read("/MaterialValidation?$count", {
                        filters: [itemFilters],
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                // that.iconDialog = "X";
                                that.Cm7 = that.getView().getModel("i18n").getResourceBundle();
                   that.crMsg = that.Cm7.getText("CRproceed");    
                  sap.m.MessageBox.information((that.crMsg),    
                    {
                                        actions: [
                                            sap.m.MessageBox.Action.OK,
                                            sap.m.MessageBox.Action.CANCEL,
                                        ],
                                        onClose: function (sAction) {
                                            if (sAction == "OK") {
                                                that.OnItemDetails(oEvent);
                                            } else {
                                                //pressDialog.close();
                                            }
                                        },
                                    }
                                );
                            } else {
                                that.OnItemDetails(oEvent);
                            }
                        },
                        error: function (e) { },
                    });
                } else {
                    that.OnItemDetails(oEvent);
                }
            }, 

            OnItemDetails: function (oEvent) {
                CRNo = this.getView().byId(
                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
                var that = this;
                this.oModel = this.getView().getModel();
                this.oModel.setUseBatch(false);
                var pathdata = this.getView().getModel().getProperty(this.spath);
                var productType = pathdata.ProductType;
                var productTypeFilter = new sap.ui.model.Filter({
                    path: "Desc",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: productType,
                });
                var oFilter = new Array();
                oFilter.push(productTypeFilter);
                if (productType != null) {
                    that.oModel.read("/ProductName", {
                        filters: [oFilter],
                        success: function (oData) {
                            if (oData.results.length != 0) {
                                that.oModel.read(
                                    "/ProductName" +
                                    "(" +
                                    oData.results[0].Id +
                                    ")/" +
                                    "ProductIssue",
                                    {
                                        success: function (oData) {
                                            that
                                                .getOwnerComponent()
                                                .getModel("productIssueModel")
                                                .setProperty("/", oData.results);
                                        },
                                        error: function (e) { },
                                    }
                                );
                            }
                        },
                        error: function (e) { },
                    });
                }
                pressDialog = sap.ui.getCore().byId("ListDialog");
                this.LanguageSelect = sap.ui.getCore().getConfiguration().getLanguage();

                if (this.LanguageSelect == "en" || this.LanguageSelect == "en-US") {
                  pressDialog = sap.ui.xmlfragment(
                    "createstorecr.ext.fragments.IconDialogEn",
                    this
                  );
                    this.getView().addDependent(pressDialog);
                    sap.ui.getCore().byId("ProductName").setValue(productType);
                    sap.ui.getCore().byId("openqty").setText(sTotalOpenQty);
                    oAttachmentUpl = sap.ui.getCore().byId("attachmentUpl");
                    oAttachmentUpl1 = sap.ui.getCore().byId("attachmentUpl1");
                    oAttachmentUpl2 = sap.ui.getCore().byId("attachmentUpl2");
                    if (CRNo == undefined) {
                        var crqty = sap.ui.getCore().byId("idstep").getValue();
                        var oQty = parseInt(pathdata.Qty);
                        if (crqty == 0) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("Idsave").setEnabled(false);
                            sap.ui.getCore().byId("idstep").setMin(0);
                        } else {
                            sap.ui.getCore().byId("idcbox").setEnabled(true);
                            sap.ui.getCore().byId("Idsave").setEnabled(true);
                        }
                        sap.ui.getCore().byId("idstep").setValue(0);
                        sap.ui.getCore().byId("idstep").setMax(oQty);
                        sap.ui.getCore().byId("idstep").setMin(0);
                    } else {
                        var BTCRNO = new sap.ui.model.Filter({
                            path: "BTPCRNo_BTPCRNO",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: CRNo,
                        });
                        var Description = new sap.ui.model.Filter({
                            path: "Material",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: pathdata.ItemNo,
                        });
                        var StatusCode = new sap.ui.model.Filter({
                            path: "StatusCode_Id",
                            operator: sap.ui.model.FilterOperator.NE,
                            value1: deleteID,
                        });
                        var oFilter = new Array();
                        oFilter.push(BTCRNO);
                        oFilter.push(Description);
                        oFilter.push(StatusCode);
                        this.oModel.read("/CreditReqItem", {
                            filters: [oFilter],
                            urlParameters: {
                                $expand: "Attachment/AttachmentPIssue",
                            },
                            success: function (oData) {
                                icondata = oData;
                                if (oData.results.length !== 0) {
                                    var t1 = [];
                                    for (var i in oData.results[0].Attachment.results[0]
                                        .AttachmentPIssue.results) {
                                        t1.push(
                                            oData.results[0].Attachment.results[0].AttachmentPIssue.results[
                                                i
                                            ].ProductIssueMaster_Id.toString()
                                        );
                                    }
                                    sap.ui.getCore().byId("idProductIssueMCB").setEnabled(true).setSelectedKeys(t1);
                                    Attachmentid =
                                        oData.results[0].Attachment.results[0].AttachmentId;
                                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(
                                        {
                                            pattern: "yyyy-MM-dd",
                                            UTC: "true",
                                        }
                                    );
                                 
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[4]
                                        .setEnabled(true)
                                        .setValue(
                                            oData.results[0].Attachment.results[0].UseByDate == null
                                                ? ""
                                                : oDateFormat.format(
                                                    new Date(
                                                        oData.results[0].Attachment.results[0].UseByDate
                                                    )
                                                )
                                        );
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[6]
                                        .setEnabled(true)
                                        .setValue(
                                            oData.results[0].Attachment.results[0].JulianDate == null
                                                ? ""
                                                : oDateFormat.format(
                                                    new Date(
                                                        oData.results[0].Attachment.results[0].JulianDate
                                                    )
                                                )
                                        );
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[11]
                                        .setEnabled(true)
                                        .setValue(oData.results[0].Attachment.results[0].LotCode)
                                        ;
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[13]
                                        .setEnabled(true)
                                        .setValue(
                                            oData.results[0].Attachment.results[0].MfgDate == null
                                                ? ""
                                                : oDateFormat.format(
                                                    new Date(
                                                        oData.results[0].Attachment.results[0].MfgDate
                                                    )
                                                )
                                        );
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[15]
                                        .setEnabled(true)
                                        .setValue(
                                            oData.results[0].Attachment.results[0].ExpirationDate ==
                                                null
                                                ? ""
                                                : oDateFormat.format(
                                                    new Date(
                                                        oData.results[0].Attachment.results[0].ExpirationDate
                                                    )
                                                )
                                        );
                                    sap.ui
                                        .getCore()
                                        .byId("Quality")
                                        .getContent()[8]
                                        .setEnabled(true)
                                        .setValue(
                                            oData.results[0].Attachment.results[0].BestBeforeDate ==
                                                null
                                                ? ""
                                                : oDateFormat.format(
                                                    new Date(
                                                        oData.results[0].Attachment.results[0].BestBeforeDate
                                                    )
                                                )
                                        );
                                    that.oModel.read(
                                        "/Attachment(AttachmentId=" +
                                        Attachmentid +
                                        ")/AttachmentRow",
                                        {
                                            success: function (oData) {
                                                oAttachmentsModel.setProperty("/", []);
                                                oAttachmentsModel.setProperty("/", oData);
                                                oAttachmentUpl
                                                    .setModel(oAttachmentsModel)
                                                    .bindAggregation(
                                                        "items",
                                                        "/results",
                                                        new sap.m.upload.UploadSetItem({
                                                            fileName: "{FileName}",
                                                            mediaType: "{MediaType}",
                                                            visibleEdit: false,
                                                            visibleRemove: true,
                                                            url: "{Url}",
                                                            openPressed: that.onOpenPressed,
                                                        })
                                                    );
                                                oAttachmentsModel1.setProperty("/", []);
                                                oAttachmentsModel1.setProperty("/", oData);
                                                oAttachmentUpl1
                                                    .setModel(oAttachmentsModel1)
                                                    .bindAggregation(
                                                        "items",
                                                        "/results",
                                                        new sap.m.upload.UploadSetItem({
                                                            fileName: "{FileName}",
                                                            mediaType: "{MediaType}",
                                                            visibleEdit: false,
                                                            visibleRemove: true,
                                                            url: "{Url}",
                                                            openPressed: that.onOpenPressed,
                                                        })
                                                    );
                                                oAttachmentsModel2.setProperty("/", []);
                                                oAttachmentsModel2.setProperty("/", oData);
                                                oAttachmentUpl2
                                                    .setModel(oAttachmentsModel2)
                                                    .bindAggregation(
                                                        "items",
                                                        "/results",
                                                        new sap.m.upload.UploadSetItem({
                                                            fileName: "{FileName}",
                                                            mediaType: "{MediaType}",
                                                            visibleEdit: false,
                                                            visibleRemove: true,
                                                            url: "{Url}",
                                                            openPressed: that.onOpenPressed,
                                                        })
                                                    );
                                                sap.ui
                                                    .getCore()
                                                    .byId("LotCode")
                                                    .setValue(
                                                        icondata.results[0].Attachment.results[0].LotCode
                                                    );
                                                //   sap.ui
                                                //     .getCore()
                                                //     .byId("coments")
                                                //     .setValue(
                                                //       icondata.results[0].Attachment.results[0].Comment
                                                //     );
                                                sap.ui
                                                    .getCore()
                                                    .byId("idstep")
                                                    .setValue(icondata.results[0].Qty);
                                                var oQty1 = icondata.results[0].Qty;
                                                var oQuantity = parseInt(pathdata.Qty);
                                                sap.ui.getCore().byId("idstep").setMax(oQuantity);
                                                if (
                                                    icondata.results[0].Attachment.results[0].ExpDate !=
                                                    null
                                                ) {
                                                    var d = oDateFormat.format(
                                                        new Date(
                                                            icondata.results[0].Attachment.results[0].ExpDate
                                                        )
                                                    );
                                                    sap.ui.getCore().byId("Expdate").setValue(d);
                                                }
                                                if (
                                                    icondata.results[0].Attachment.results[0]
                                                        .DeliveryDate != null
                                                ) {
                                                    var Deliverydate = oDateFormat.format(
                                                        new Date(
                                                            icondata.results[0].Attachment.results[0].DeliveryDate
                                                        )
                                                    );
                                                    sap.ui
                                                        .getCore()
                                                        .byId("DeliveryDate")
                                                        .setValue(Deliverydate);
                                                }
                                                if (icondata.results[0].CRType_Id == 1) {
                                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                                    sap.ui.getCore().byId("idcbox").setSelectedKey(1);
                                                    sap.ui.getCore().byId("Damage").setVisible(true);
                                                    sap.ui.getCore().byId("Quality").setVisible(false);
                                                    sap.ui
                                                        .getCore()
                                                        .byId("idQualityPhoto")
                                                        .setVisible(false);
                                                } else if (icondata.results[0].CRType_Id == 2) {
                                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                                    sap.ui.getCore().byId("idcbox").setSelectedKey(2);
                                                    sap.ui.getCore().byId("Damage").setVisible(false);
                                                    sap.ui.getCore().byId("Shortage").setVisible(true);
                                                    sap.ui.getCore().byId("Quality").setVisible(false);
                                                    sap.ui
                                                        .getCore()
                                                        .byId("idQualityPhoto")
                                                        .setVisible(false);
                                                } else if (icondata.results[0].CRType_Id == 3) {
                                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                                    sap.ui.getCore().byId("idcbox").setSelectedKey(3);
                                                    sap.ui.getCore().byId("Damage").setVisible(false);
                                                    sap.ui.getCore().byId("Shortage").setVisible(false);
                                                    sap.ui.getCore().byId("Quality").setVisible(true);
                                                    sap.ui
                                                        .getCore()
                                                        .byId("idQualityPhoto")
                                                        .setVisible(true);
                                                }
                                                pressDialog.open();
                                            },
                                            error: function (e) { },
                                        }
                                    );
                                } else {
                                    sap.ui.getCore().byId("LotCode").setValue();
                                    //   sap.ui.getCore().byId("coments").setValue();
                                    sap.ui.getCore().byId("idstep").setValue(0);
                                    var crqty = sap.ui.getCore().byId("idstep").getValue();
                                    var oQty = parseInt(pathdata.Qty);
                                    if (crqty == 0) {
                                        sap.ui.getCore().byId("idcbox").setEnabled(false);
                                        sap.ui.getCore().byId("Idsave").setEnabled(false);
                                        sap.ui.getCore().byId("idstep").setMin(0);
                                    } else {
                                        sap.ui.getCore().byId("idcbox").setEnabled(true);
                                        sap.ui.getCore().byId("Idsave").setEnabled(true);
                                    }
                                    sap.ui.getCore().byId("idstep").setValue(0);
                                    sap.ui.getCore().byId("idstep").setMax(oQty);
                                    sap.ui.getCore().byId("idstep").setMin(0);
                                    pressDialog.open();
                                }
                            },
                            error: function (error) { },
                        });
                    }
                }
                if (this.LanguageSelect == "fr-CA") {
                    pressDialog = sap.ui.xmlfragment( 
                      "createstorecr.ext.fragments.IconDialogFr",
                      this
                    );
                    this.getView().addDependent(pressDialog);
                    sap.ui.getCore().byId("ProductName").setValue(productType);
                    sap.ui.getCore().byId("openqty").setText(sTotalOpenQty);
                    oAttachmentUpl = sap.ui.getCore().byId("attachmentUpl");
                    oAttachmentUpl1 = sap.ui.getCore().byId("attachmentUpl1");
                    oAttachmentUpl2 = sap.ui.getCore().byId("attachmentUpl2");
                    if (CRNo == undefined) {
                      var crqty = sap.ui.getCore().byId("idstep").getValue();
                      var oQty = parseInt(pathdata.Qty);
                      if (crqty == 0) {
                        sap.ui.getCore().byId("idcbox").setEnabled(false);
                        sap.ui.getCore().byId("Idsave").setEnabled(false);
                        sap.ui.getCore().byId("idstep").setMin(0);
                      } else {
                        sap.ui.getCore().byId("idcbox").setEnabled(true);
                        sap.ui.getCore().byId("Idsave").setEnabled(true);
                      }
                      sap.ui.getCore().byId("idstep").setValue(0);
                      sap.ui.getCore().byId("idstep").setMax(oQty);
                      sap.ui.getCore().byId("idstep").setMin(0);
                    } else {
                      var BTCRNO = new sap.ui.model.Filter({
                        path: "BTPCRNo_BTPCRNO",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: CRNo,
                      });
                      var Description = new sap.ui.model.Filter({
                        path: "Material",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: pathdata.ItemNo,
                      });
                      var StatusCode = new sap.ui.model.Filter({
                        path: "StatusCode_Id",
                        operator: sap.ui.model.FilterOperator.NE,
                        value1: deleteID,
                      });
                      var oFilter = new Array();
                      oFilter.push(BTCRNO);
                      oFilter.push(Description);
                      oFilter.push(StatusCode);
                      this.oModel.read("/CreditReqItem", {
                        filters: [oFilter],
                        urlParameters: {
                          $expand: "Attachment/AttachmentPIssue",
                        },
                        success: function (oData) {
                          icondata = oData;
                          if (oData.results.length !== 0) {
                            var t1 = [];
                            for (var i in oData.results[0].Attachment.results[0]
                              .AttachmentPIssue.results) {
                              t1.push(
                                oData.results[0].Attachment.results[0].AttachmentPIssue.results[
                                  i
                                ].ProductIssueMaster_Id.toString()
                              );
                            }
                            sap.ui.getCore().byId("idProductIssueMCB").setEnabled(true).setSelectedKeys(t1);
                              
                            Attachmentid =
                              oData.results[0].Attachment.results[0].AttachmentId;
                            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(
                              {
                                pattern: "yyyy-MM-dd",
                                UTC: "true",
                              }
                            );
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[4]
                              .setEnabled(true);
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[4]
                              .setEnabled(true)
                              .setValue(
                                oData.results[0].Attachment.results[0].UseByDate == null
                                  ? ""
                                  : oDateFormat.format(
                                      new Date(
                                        oData.results[0].Attachment.results[0].UseByDate
                                      )
                                    )
                              );
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[6]
                              .setEnabled(true)
                              .setValue(
                                oData.results[0].Attachment.results[0].JulianDate == null
                                  ? ""
                                  : oDateFormat.format(
                                      new Date(
                                        oData.results[0].Attachment.results[0].JulianDate
                                      )
                                    )
                              );
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[11]
                              .setEnabled(true)
                              .setValue(oData.results[0].Attachment.results[0].LotCode);
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[13]
                              .setEnabled(true)
                              .setValue(
                                oData.results[0].Attachment.results[0].MfgDate == null
                                  ? ""
                                  : oDateFormat.format(
                                      new Date(
                                        oData.results[0].Attachment.results[0].MfgDate
                                      )
                                    )
                              );
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[15]
                              .setEnabled(true)
                              .setValue(
                                oData.results[0].Attachment.results[0].ExpirationDate ==
                                  null
                                  ? ""
                                  : oDateFormat.format(
                                      new Date(
                                        oData.results[0].Attachment.results[0].ExpirationDate
                                      )
                                    )
                              );
                            sap.ui
                              .getCore()
                              .byId("Quality")
                              .getContent()[8]
                              .setEnabled(true)
                              .setValue(
                                oData.results[0].Attachment.results[0].BestBeforeDate ==
                                  null
                                  ? ""
                                  : oDateFormat.format(
                                      new Date(
                                        oData.results[0].Attachment.results[0].BestBeforeDate
                                      )
                                    )
                              );
                            that.oModel.read(
                              "/Attachment(AttachmentId=" +
                                Attachmentid +
                                ")/AttachmentRow",
                              {
                                success: function (oData) {
                                  oAttachmentsModel.setProperty("/", []);
                                  oAttachmentsModel.setProperty("/", oData);
                                  oAttachmentUpl
                                    .setModel(oAttachmentsModel)
                                    .bindAggregation(
                                      "items",
                                      "/results",
                                      new sap.m.upload.UploadSetItem({
                                        fileName: "{FileName}",
                                        mediaType: "{MediaType}",
                                        visibleEdit: false,
                                        visibleRemove: true,
                                        url: "{Url}",
                                        openPressed: that.onOpenPressed,
                                      })
                                    );
                                  oAttachmentsModel1.setProperty("/", []);
                                  oAttachmentsModel1.setProperty("/", oData);
                                  oAttachmentUpl1
                                    .setModel(oAttachmentsModel1)
                                    .bindAggregation(
                                      "items",
                                      "/results",
                                      new sap.m.upload.UploadSetItem({
                                        fileName: "{FileName}",
                                        mediaType: "{MediaType}",
                                        visibleEdit: false,
                                        visibleRemove: true,
                                        url: "{Url}",
                                        openPressed: that.onOpenPressed,
                                      })
                                    );
                                    oAttachmentsModel2.setProperty("/", []);
                                    oAttachmentsModel2.setProperty("/", oData);
                                    oAttachmentUpl2
                                      .setModel(oAttachmentsModel2)
                                      .bindAggregation(
                                        "items",
                                        "/results",
                                        new sap.m.upload.UploadSetItem({
                                          fileName: "{FileName}",
                                          mediaType: "{MediaType}",
                                          visibleEdit: false,
                                          visibleRemove: true,
                                          url: "{Url}",
                                          openPressed: that.onOpenPressed,
                                        })
                                      );
                                  sap.ui
                                    .getCore()
                                    .byId("LotCode")
                                    .setValue(
                                      icondata.results[0].Attachment.results[0].LotCode
                                    );
                                //   sap.ui
                                //     .getCore()
                                //     .byId("coments")
                                //     .setValue(
                                //       icondata.results[0].Attachment.results[0].Comment
                                //     );
                                  sap.ui
                                    .getCore()
                                    .byId("idstep")
                                    .setValue(icondata.results[0].Qty);
                                  var oQty1 = icondata.results[0].Qty;
                                  var oQuantity = parseInt(pathdata.Qty);
                                  sap.ui.getCore().byId("idstep").setMax(oQuantity);
                                  if (
                                    icondata.results[0].Attachment.results[0].ExpDate !=
                                    null
                                  ) {
                                    var d = oDateFormat.format(
                                      new Date(
                                        icondata.results[0].Attachment.results[0].ExpDate
                                      )
                                    );
                                    sap.ui.getCore().byId("Expdate").setValue(d);
                                  }
                                  if (
                                    icondata.results[0].Attachment.results[0]
                                      .DeliveryDate != null
                                  ) {
                                    var Deliverydate = oDateFormat.format(
                                      new Date(
                                        icondata.results[0].Attachment.results[0].DeliveryDate
                                      )
                                    );
                                    sap.ui
                                      .getCore()
                                      .byId("DeliveryDate")
                                      .setValue(Deliverydate);
                                  }
                                  if (icondata.results[0].CRType_Id == 1) {
                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                    sap.ui.getCore().byId("idcbox").setSelectedKey(1);
                                    sap.ui.getCore().byId("Damage").setVisible(true);
                                    sap.ui.getCore().byId("Quality").setVisible(false);
                                    sap.ui
                                      .getCore()
                                      .byId("idQualityPhoto")
                                      .setVisible(false);
                                  } else if (icondata.results[0].CRType_Id == 2) {
                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                    sap.ui.getCore().byId("idcbox").setSelectedKey(2);
                                    sap.ui.getCore().byId("Damage").setVisible(false);
                                    sap.ui.getCore().byId("Shortage").setVisible(true);
                                    sap.ui.getCore().byId("Quality").setVisible(false);
                                    sap.ui
                                      .getCore()
                                      .byId("idQualityPhoto")
                                      .setVisible(false);
                                  } else if (icondata.results[0].CRType_Id == 3) {
                                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                                    sap.ui.getCore().byId("idcbox").setSelectedKey(3);
                                    sap.ui.getCore().byId("Damage").setVisible(false);
                                    sap.ui.getCore().byId("Shortage").setVisible(false);
                                    sap.ui.getCore().byId("Quality").setVisible(true);
                                    sap.ui
                                      .getCore()
                                      .byId("idQualityPhoto")
                                      .setVisible(true);
                                  }
                                  pressDialog.open();
                                },
                                error: function (e) {},
                              }
                            );
                          } else {
                            sap.ui.getCore().byId("LotCode").setValue();
                         //   sap.ui.getCore().byId("coments").setValue();
                            sap.ui.getCore().byId("idstep").setValue(0);
                            var crqty = sap.ui.getCore().byId("idstep").getValue();
                            var oQty = parseInt(pathdata.Qty);
                            if (crqty == 0) {
                              sap.ui.getCore().byId("idcbox").setEnabled(false);
                              sap.ui.getCore().byId("Idsave").setEnabled(false);
                              sap.ui.getCore().byId("idstep").setMin(0);
                            } else {
                              sap.ui.getCore().byId("idcbox").setEnabled(true);
                              sap.ui.getCore().byId("Idsave").setEnabled(true);
                            }
                            sap.ui.getCore().byId("idstep").setValue(0);
                            sap.ui.getCore().byId("idstep").setMax(oQty);
                            sap.ui.getCore().byId("idstep").setMin(0);
                            pressDialog.open();
                          }
                        },
                        error: function (error) {},
                      });
                    }
                  }   
                  else {
                    pressDialog.open();
                  }
                  pressDialog.open();
                },
            onChange: function () {
                var oValues = sap.ui.getCore().byId("idstep");
                var oValues2 = sap.ui.getCore().byId("idcbox");
                var oValue = oValues.getValue();
                var oValue2 = oValues2.getValue();
               
                oValues.setMax(sTotalOpenQty);
                if (oValue > sTotalOpenQty) {
                    sap.ui.getCore().byId("idstep").setValueState("Error");
                    var MaxMsg = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.warning(MaxMsg.getText("CRQtyshouldnotMaxQty"));
                  
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                    sap.ui.getCore().byId("idcbox").setEnabled(false);
                    return false;
                }
                var oValue = sap.ui.getCore().byId("idstep").getValue();
                if (CRNo == undefined) {
                    if (oValue == 0) {
                        sap.ui.getCore().byId("idcbox").setEnabled(false);
                        sap.ui.getCore().byId("Idsave").setEnabled(false);
                    } else {
                        sap.ui.getCore().byId("idcbox").setEnabled(true);
                        sap.ui.getCore().byId("Idsave").setEnabled(true);
                    }
                } else {
                    var pathdata = this.getView().getModel().getProperty(this.spath);
                    if (
                        pathdata.CRQty == 0 ||
                        pathdata.CRQty == undefined ||
                        pathdata.CRQty == ""
                    ) {
                        if (oValue == 0 && oValue2 == "") {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("Idsave").setEnabled(false);
                        } else if (oValue > 0 && oValue2 != "") {
                            sap.ui.getCore().byId("idcbox").setEnabled(true);
                            // sap.ui.getCore().byId("Idsave").setEnabled(true);
                        } else {
                            sap.ui.getCore().byId("idcbox").setEnabled(true);
                            sap.ui.getCore().byId("Idsave").setEnabled(false);
                        }
                    } else {
                        if (oValue == 0) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("Idsave").setEnabled(false);
                        } else if (oValue > 0 && oValue2 != "") {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            // sap.ui.getCore().byId("Idsave").setEnabled(true);
                        } else {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            // sap.ui.getCore().byId("Idsave").setEnabled(true);
                        }
                    }
                }
                if (oValue == 0 || oValue2 == "") {
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                    return
                }
                else{
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
      
                }
            },

            oSelectionchange: function (oevt) {
                if (oevt.getSource().getSelectedItem() === null) {
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                }
                var oSelectedkey = oevt.getSource().getSelectedItem().getKey();
                if (oSelectedkey !== "") {
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                }
                else {
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                }
                if (oSelectedkey == "1") {
                    sap.ui.getCore().byId("Damage").setVisible(true);
                    sap.ui.getCore().byId("Shortage").setVisible(false);
                    sap.ui.getCore().byId("Quality").setVisible(false);
                    sap.ui.getCore().byId("idQualityPhoto").setVisible(false);
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                } else if (oSelectedkey == "2") {
                    sap.ui.getCore().byId("Damage").setVisible(false);
                    sap.ui.getCore().byId("Shortage").setVisible(true);
                    sap.ui.getCore().byId("Quality").setVisible(false);
                    sap.ui.getCore().byId("idQualityPhoto").setVisible(false);
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                } else if (oSelectedkey == "3") {
                    sap.ui.getCore().byId("Damage").setVisible(false);
                    sap.ui.getCore().byId("Shortage").setVisible(false);
                    sap.ui.getCore().byId("Quality").setVisible(true);
                    sap.ui.getCore().byId("idQualityPhoto").setVisible(true);
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                } else if (oSelectedkey == "4") {
                    sap.ui.getCore().byId("Damage").setVisible(false);
                    sap.ui.getCore().byId("Shortage").setVisible(false);
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                    sap.ui.getCore().byId("NotShipped").setVisible(true);
                }
            },

            onClose: function () {
                pressDialog.close();
                this._itemDialogDestroy();
                pressDialog.destroy();
            },

            onAfterItemAdded: function (oEvent) {
                var oCalledEvent = oEvent.getParameter("id");
                var item = oEvent.getParameter("item");
                this._createEntity(item, oCalledEvent);
            },

            onUploadCompleted: function (oEvent) {
                oAttachmentUpl.removeAllIncompleteItems();
            },

            _uploadContent: function (item, result, oCalledEvent) {
                var Url = result.__metadata.media_src.replaceAll("'", "");
                Url = Url.replace("$value", "Content");
                Url = Url.replace("guid", "");
                item.setUploadUrl(Url);
                item.setUrl(Url);
                oAttachmentUpl.setHttpRequestMethod("PUT");
                oAttachmentUpl.uploadItem(item);
                if (oCalledEvent === "attachmentUpl") {
                    var data = {
                        id: result.Id,
                        MediaType: item.getMediaType(),
                        FileName: item.getFileName(),
                        Size: item.getFileObject().size,
                    };
                    uploadedFileDamage.push(data);
                } else if (oCalledEvent === "attachmentUpl1") {
                    data = {
                        id: result.Id,
                        MediaType: item.getMediaType(),
                        FileName: item.getFileName(),
                        Size: item.getFileObject().size,
                    };
                    uploadedFileQuality.push(data);
                } else if (oCalledEvent === "attachmentUpl2") {
                    data = {
                        id: result.Id,
                        MediaType: item.getMediaType(),
                        FileName: item.getFileName(),
                        Size: item.getFileObject().size,
                    };
                    uploadedFileShortage.push(data);
                }
            },

            _createEntity: function (item, oCalledEvent) {
                var data = {
                    MediaType: item.getMediaType(),
                    FileName: item.getFileName(),
                    Size: item.getFileObject().size,
                };
                var that = this;
                this.oModel.create("/AttachmentRow", data, {
                    method: "POST",
                    success: function (data) {
                        that._uploadContent(item, data, oCalledEvent);
                    },
                    error: function (data) {
                        sap.m.MessageBox.error("Error");
                    },
                });
            },

            // ###### Upload Items
            onBeforeItemAdded: function (oEvent) {
                oAttachmentUpl = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var oItem = oEvent.getParameter("item");
                oItem.setVisibleEdit(false);
                var Data = oAttachmentUpl.getModel().getData();
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
                //   if (uploadedFileDamage.length > 0) {
                //     fileIndex = uploadedFileDamage.findIndex(
                //       (x) => x.FileName === oItem.getFileName()
                //     );
                //     if (fileIndex >= 0) {
                //       oEvent.preventDefault();
                //       sap.m.MessageToast.show("File with same name already exists");
                //       return;
                //     }
                //   }
                //   if (uploadedFileShortage.length > 0) {
                //     fileIndex = uploadedFileShortage.findIndex(
                //       (x) => x.FileName === oItem.getFileName()
                //     );
                //     if (fileIndex >= 0) {
                //       oEvent.preventDefault();
                //       sap.m.MessageToast.show("File with same name already exists");
                //       return;
                //     }
                //   }
                //   if (uploadedFileQuality.length > 0) {
                //     fileIndex = uploadedFileQuality.findIndex(
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
                    sap.ui.getCore().byId(evt.getParameter("id")).removeItem(oItem);
                    if (Data.results.length > 0) {
                        var ID = Data.results.filter(
                            (x) => x.FileName === oItem.getFileName()
                        )[0].Id;
                        if (oCalledEvent === "attachmentUpl") {
                            removedFileDamage.push(ID);
                        } else if (oCalledEvent === "attachmentUpl1") {
                            removedFileQuality.push(ID);
                        } else if (oCalledEvent === "attachmentUpl2") {
                            removedFileShortage.push(ID);
                        }
                    }


                } else {
                    sap.ui.getCore().byId(evt.getParameter("id")).removeItem(oItem);
                    if (oCalledEvent === "attachmentUpl") {
                        var fileIndex = uploadedFileDamage.findIndex(
                            (x) => x.FileName === oItem.getFileName()
                        );
                        uploadedFileDamage.splice(fileIndex, 1);
                    } else if (oCalledEvent === "attachmentUpl1") {
                        var fileIndex = uploadedFileQuality.findIndex(
                            (x) => x.FileName === oItem.getFileName()
                        );
                        uploadedFileQuality.splice(fileIndex, 1);
                    } else if (oCalledEvent === "attachmentUpl2") {
                        var fileIndex = uploadedFileShortage.findIndex(
                            (x) => x.FileName === oItem.getFileName()
                        );
                        uploadedFileShortage.splice(fileIndex, 1);
                    }
                }
            },

            onOpenPressed: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                var oCalledEvent = oEvent.getParameters().item.getParent().getId();
                if (oCalledEvent === "attachmentUpl") {
                    var oData = this.getModel("oAttachmentsModel").getData().results;
                } else if (oCalledEvent === "attachmentUpl1") {
                    oData = this.getModel("oAttachmentsModel1").getData().results;
                } else if (oCalledEvent === "attachmentUpl2") {
                    oData = this.getModel("oAttachmentsModel2").getData().results;
                }
                var Url = oData.find((x) => x.FileName === oItem.getFileName())
                    .__metadata.media_src;
                oItem.setUrl(Url);
            },

            onProductName: function (evt) {
                selProduct = evt.getSource().getSelectedItem().getKey();
                this._productIssueData();
            },

            _productIssueData: function () {
                var oDataModel = this.getView().getModel();
                var sel = parseInt(selProduct);
                var path = "/ProductName" + "(" + sel + ")/" + "ProductIssue";
                var that = this;
                oDataModel.read(path, {
                    success: function (oData) {
                        that
                            .getOwnerComponent()
                            .getModel("productIssueModel")
                            .setProperty("/", oData.results);
                    },
                    error: function (error) { },
                });
            },

            //#####post CR data and generating CR No.
            onSave: function () {
                crqty = sap.ui.getCore().byId("idstep").getValue();
                critm = sap.ui.getCore().byId("idcbox").getSelectedItem().getText();

                if (crqty === 0) {
                    sap.ui.getCore().byId("idstep").setValueState("Error");
                    var CRQtyMsg = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.warning(CRQtyMsg.getText("CRQtynotZero"));
                                       return false;
                }
                if (
                    sap.ui.getCore().byId("idcbox").getSelectedKey() === "3" &&
                    (sap.ui.getCore().byId("idProductIssueMCB").getSelectedKeys()
                        .length === 0 ||
                        (uploadedFileQuality.length === 0 &&
                            oAttachmentUpl1.getItems().length === 0))
                ) {
                    var MsgConfrom1 = this.getView().getModel("i18n").getResourceBundle();

                    sap.m.MessageBox.error(MsgConfrom1.getText("PleaseRequiredBeforeSaving"));
        
                    return;
                }

                if (
                    sap.ui.getCore().byId("idcbox").getSelectedKey() === "3" &&
                    (sap.ui.getCore().byId("QLotCode").getValue() === "" ||
                        sap.ui.getCore().byId("ManufactureDate").getValue() === "" ||
                        sap.ui.getCore().byId("ExpirationDate").getValue() === "" ||
                        sap.ui.getCore().byId("BestBeforeDate").getValue() === "" ||
                        sap.ui.getCore().byId("UseByDate").getValue() === "" ||
                        sap.ui.getCore().byId("JulianDate").getValue() === "")
                ) {
                    var MsgCnfm = this.getView().getModel("i18n").getResourceBundle();
            sap.m.MessageBox.confirm(MsgCnfm.getText("LotCodefillcannotCRUnderReview"),
                this.proceedToSave.bind(this),
                        "Confirmation"
                    );
                } else {
                    this.proceedToSave();
                }
            },

            proceedToSave: function (soption) {
                if (soption === "OK" || soption === undefined) {
                    if (CRNo == undefined) {
                        this._crCreate();
                    } else {
                        this._ItemAddtocr();
                    }
                }
            },

            fnChange: function (oEvt) {
                var date = new Date();
                var gSelectedDate = oEvt.getParameters().newValue;
                gSelectedDate = new Date(gSelectedDate);
                var sID = oEvt.getSource().getId();
                if (gSelectedDate > date) {
                    sap.ui.getCore().byId(sID).setValueState("Error");
                    var ErrMesge = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.error(ErrMesge.getText("Futuredatenotallowed"));
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                    return false;
                } else {
                    sap.ui.getCore().byId("Idsave").setEnabled(true);
                    sap.ui.getCore().byId(sID).setValueState("Success");
                }
            },

            convertToJSONDate: function (oStarttestDate) {
                var sDate = "";
                if (oStarttestDate === "" || oStarttestDate === null) {
                    sDate = "";
                    return sDate;
                } else {
                    var sdate = new Date(oStarttestDate); // Or the date you'd like converted.
                    var isoDateTime = new Date(
                        sdate.getTime() - sdate.getTimezoneOffset() * 60000
                    )
                        .toISOString()
                        .slice(0, 10);
                    return isoDateTime;
                }
            }, 
//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Draft CR creation popup modification
//==================================

            _crCreate: function () {
              

                var that = this;
                var selKey = sap.ui.getCore().byId("idcbox").getSelectedKey();
                var qualityModel = this.getOwnerComponent().getModel("qualityModel");
                var productName = qualityModel.getProperty("/ProductName");
                var productIssue = qualityModel.getProperty("/ProductIssue");
                var path = this.spath;
                itemdata = this.getView().getModel().getProperty(path);
                var HeaderPath = this.getView().getBindingContext().getPath();
                var HeaderData = this.getView().getModel().getProperty(HeaderPath);
                var AttachmentPIssue = [];
                for (var i in productIssue) {
                    var obj = {
                        ProductIssueMaster_Id: productIssue[i],
                    };
                    AttachmentPIssue.push(obj);
                }
                if (selKey === "1" && uploadedFileDamage.length === 0) {
                    var SlectCT  = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.error(SlectCT.getText("PleaseRequiredBeforeSaving"));
                   
                    return;
                } else if (selKey === "") {
                    sap.m.MessageBox.error(SlectCT.getText("PleaseCreditType"));
                    return;
                } else {
                    var lLotcode;
                    if (selKey === "1") {
                        lLotcode = sap.ui.getCore().byId("LotCode").getValue();
                    } else if (selKey === "3") {
                        lLotcode = sap.ui.getCore().byId("QLotCode").getValue();
                    }
                    sap.ui.getCore().byId("Idsave").setEnabled(false);
                    var obj = {
                        CRDocDate: new Date(),
                        PSInvoiceHdr_PsplInvoice: HeaderData.PsplInvoice,
                        SalesOrderNo: HeaderData.SalesOrderNo,
                        AccessCR: HeaderData.AccessCR,
                        DomicasCR: HeaderData.DomicasCR,
                        SAPCR: HeaderData.SAPCR,
                        ChangedDateTime: new Date(),
                        CreatedDateTime: new Date(),
                        SCC_Id: this.SCCID,
                        SCC_RegionId: this.RegionIdID,
                        PSInvoiceStoreId: HeaderData.StoreId,
                        PSInvoiceFrnId: HeaderData.FranchiseId,
                        StatusCode_Id: 5,
                        StatusCode_ObjectType_Id: 1,
                        OrgStrucEleCode_Id: 1,
                        CreditReqItem: [
                            {
                                Material: itemdata.ItemNo,
                                Description: itemdata.Description,
                                Qty: sap.ui.getCore().byId("idstep").getValue(),
                                UnitPrice: itemdata.UnitPrice,
                                Tax: itemdata.Tax,
                                Total: itemdata.Total,
                                StatusCode_Id: 1,
                                StatusCode_ObjectType_Id: 1,
                                PSInvoiceQty: itemdata.Qty,
                                UnitCost: itemdata.UnitCost,
                                UnitFreight: itemdata.UnitFreight,
                                UOM: itemdata.UOM,
                                TaxAmount: itemdata.TaxAmount,
                                CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                                ProductType: itemdata.ProductType,
                                CRRowID: itemdata.InvoiceSequenceNumber,
                                Attachment: [
                                    {
                                        CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                                        LotCode: lLotcode,
                                        Comment: "",
                                        //sap.ui.getCore().byId("coments").getValue(),
                                        ExpDate:
                                            sap.ui.getCore().byId("Expdate").getValue()
                                                ?
                                                sap.ui.getCore().byId("Expdate").getValue()

                                                : null,
                                        DeliveryDate:
                                            sap.ui.getCore().byId("DeliveryDate").getValue()

                                                ? sap.ui.getCore().byId("DeliveryDate").getValue()

                                                : null,
                                        ExpirationDate:
                                            sap.ui.getCore().byId("ExpirationDate").getValue()

                                                ?
                                                sap.ui.getCore().byId("ExpirationDate").getValue()

                                                : null,
                                        MfgDate:
                                            sap.ui.getCore().byId("ManufactureDate").getValue()

                                                ?
                                                sap.ui.getCore().byId("ManufactureDate").getValue()

                                                : null,
                                        UseByDate:
                                            sap.ui.getCore().byId("UseByDate").getValue()

                                                ?
                                                sap.ui.getCore().byId("UseByDate").getValue()

                                                : null,
                                        JulianDate:
                                            sap.ui.getCore().byId("JulianDate").getValue()

                                                ?
                                                sap.ui.getCore().byId("JulianDate").getValue()

                                                : null,
                                        BestBeforeDate:
                                            sap.ui.getCore().byId("BestBeforeDate").getValue()

                                                ?
                                                sap.ui.getCore().byId("BestBeforeDate").getValue()

                                                : null,
                                        AttachmentPIssue: AttachmentPIssue,
                                    },
                                ],
                            },
                        ],
                    };
                    this.oModel.create("/CreditReqHdr", obj, {
                        method: "POST",
                        success: function (data) {
                            CRNo = that
                                .getView()
                                .byId(
                                    "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                                ).mProperties.value;
                            that
                                .getOwnerComponent()
                                .getModel("uniModel")
                                .setProperty("/crNo", CRNo);
                            if (data.CreditReqItem.results[0].Attachment.results.length > 0) {
                                that.updateAttachmentID(
                                    data.CreditReqItem.results[0].Attachment.results[0]
                                        .AttachmentId,
                                    data.CreditReqItem.results[0].CRType_Id
                                );
                            }
                            that.SuccessMsg = that.getView().getModel("i18n").getResourceBundle();
                            that.SuccessMsg1=that.SuccessMsg.getText("DraftCR");
                            that.SuccessMsg2=that.SuccessMsg.getText("AddItemsorPressSubmit");
                            that.SuccessMsg3=that.SuccessMsg.getText("DraftTitle");
                            sap.m.MessageBox.success(that.SuccessMsg.getText(that.SuccessMsg1  + " " + data.BTPCRNO + " " +  that.SuccessMsg2),
                                 {
                                    title:that.SuccessMsg.getText(that.SuccessMsg3),
                                    icon: sap.m.MessageBox.Icon.WARNING,
                            // that.SuccessMsg = that.getView().getModel("i18n").getResourceBundle();
                            // that.SuccessMsg1=that.SuccessMsg.getText("CreditRequest");
                            // that.SuccessMsg2=that.SuccessMsg.getText("CreatedSuccessfully");
                            // sap.m.MessageBox.success(that.SuccessMsg.getText(that.SuccessMsg1  + " " + data.BTPCRNO + " " +  that.SuccessMsg2),
                            //      {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (sAction) {
                                        if (sAction == "OK") {
                                            that.extensionAPI.refresh();
                                        }
                                    },
                                }
                            );
                            // that
                            //     .getView()
                            //     .byId(
                            //         "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton"
                            //     )
                            //     .setEnabled(true);
                            pressDialog.close();
                            that._itemDialogDestroy();
                            pressDialog.destroy();
                        },
                        error: function (e) {
                            sap.m.MessageBox.error( that.SuccessMsg.getText("Error"));
                        },
                    });
                }
            },

//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Draft CR creation popup modification
//==================================

            _ItemAddtocr: function () {
                var that = this;
                var selKey = sap.ui.getCore().byId("idcbox").getSelectedKey();
                var qualityModel = this.getOwnerComponent().getModel("qualityModel");
                var productName = qualityModel.getProperty("/ProductName");
                var productIssue = qualityModel.getProperty("/ProductIssue");
                var path = this.spath;
                itemdata = this.getView().getModel().getProperty(path);
                var HeaderPath = this.getView().getBindingContext().getPath();
                var HeaderData = this.getView().getModel().getProperty(HeaderPath);
                var qualityModel = this.getOwnerComponent().getModel("qualityModel");
                var lLotcode;
                if (selKey === "1") {
                    lLotcode = sap.ui.getCore().byId("LotCode").getValue();
                } else if (selKey === "3") {
                    lLotcode = sap.ui.getCore().byId("QLotCode").getValue();
                }
                var AttachmentPIssue = [];
                for (var i in productIssue) {
                    var obj = {
                        ProductIssueMaster_Id: productIssue[i],
                    };
                    AttachmentPIssue.push(obj);
                }
                if (
                    selKey === "1" &&
                    uploadedFileDamage.length === 0 &&
                    oAttachmentUpl.getItems().length === 0
                ) {
                    var ErrM2 = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.error(ErrM2.getText(
                      "PleaseRequiredBeforeSaving"
                    ));
                    return;
                } else if (selKey === "") {
                    var Ermsg = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageBox.error(Ermsg.getText("PleaseCreditType"));
                    return;
                }
                sap.ui.getCore().byId("Idsave").setEnabled(false);
                var obj1 = {
                    Material: itemdata.ItemNo,
                    Description: itemdata.Description,
                    Qty: sap.ui.getCore().byId("idstep").getValue(),
                    UnitPrice: itemdata.UnitPrice,
                    Tax: itemdata.Tax,
                    BTPCRNo_BTPCRNO: CRNo,
                    BTPCRNo_OrgStrucEleCode_Id: 1,
                    Total: itemdata.Total,
                    StatusCode_Id: 1,
                    StatusCode_ObjectType_Id: 1,
                    PSInvoiceQty: itemdata.Qty,
                    UnitCost: itemdata.UnitCost,
                    UnitFreight: itemdata.UnitFreight,
                    UOM: itemdata.UOM,
                    TaxAmount: itemdata.TaxAmount,
                    CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                    ProductType: itemdata.ProductType,
                    CRRowID: itemdata.InvoiceSequenceNumber,
                    Attachment: [
                        {
                            CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                            LotCode: lLotcode,
                            Comment: "",
                            //sap.ui.getCore().byId("coments").getValue(),
                            ExpDate:
                                sap.ui.getCore().byId("Expdate").getValue()

                                    ?
                                    sap.ui.getCore().byId("Expdate").getValue()

                                    : null,
                            DeliveryDate:
                                sap.ui.getCore().byId("DeliveryDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("DeliveryDate").getValue()

                                    : null,
                            ExpirationDate:
                                sap.ui.getCore().byId("ExpirationDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("ExpirationDate").getValue()

                                    : null,
                            MfgDate:
                                sap.ui.getCore().byId("ManufactureDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("ManufactureDate").getValue()

                                    : null,
                            UseByDate:
                                sap.ui.getCore().byId("UseByDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("UseByDate").getValue()

                                    : null,
                            JulianDate:
                                sap.ui.getCore().byId("JulianDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("JulianDate").getValue()

                                    : null,
                            BestBeforeDate:
                                sap.ui.getCore().byId("BestBeforeDate").getValue()

                                    ?
                                    sap.ui.getCore().byId("BestBeforeDate").getValue()

                                    : null,
                            AttachmentPIssue: AttachmentPIssue,
                        },
                    ],
                };
                var pathdata = this.getView().getModel().getProperty(this.spath);
                var BTCRNO = new sap.ui.model.Filter({
                    path: "BTPCRNo_BTPCRNO",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: CRNo,
                });
                var Description = new sap.ui.model.Filter({
                    path: "Material",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: pathdata.ItemNo,
                });

                var StatusCode = new sap.ui.model.Filter({
                    path: "StatusCode_Id",
                    operator: sap.ui.model.FilterOperator.NE,
                    value1: 10,
                });
                var oFilter = new Array();
                oFilter.push(BTCRNO);
                oFilter.push(Description);
                oFilter.push(StatusCode);

                this.oModel.read("/CreditReqItem", {
                    filters: [oFilter],
                    urlParameters: {
                        $expand: "Attachment",
                    },
                    success: function (oData) {
                        if (oData.results.length == 0) {
                            that.oModel.create("/CreditReqItem", obj1, {
                                method: "POST",
                                success: function (data) {
                                    if (data.Attachment.results.length > 0) {
                                        that.updateAttachmentID(
                                            data.Attachment.results[0].AttachmentId,
                                            data.CRType_Id
                                        );
                                    }
                                    var oTable1 = that
                                        .getView()
                                        .byId(
                                            "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
                                        );
                                        that.MsgSucess = that.getView().getModel("i18n").getResourceBundle();
                                        that.MsgSucess1=that.MsgSucess.getText("DraftCR");
                                        that.SuccessMsg2=that.MsgSucess.getText("AddItemsorPressSubmit");
                                        that.SuccessMsg3=that.MsgSucess.getText("DraftTitle");    
                                        sap.m.MessageBox.success(that.MsgSucess1 + " " +  CRNo + " "+that.SuccessMsg2, {
                                        title:that.MsgSucess.getText(that.SuccessMsg3),
                                        icon: sap.m.MessageBox.Icon.WARNING,  
                                    //     that.MsgSucess1=that.MsgSucess.getText("ItemAddedtoCR");
                                    //   sap.m.MessageBox.success(that.MsgSucess1 + " " +  CRNo + "", {
                                           actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (sAction) {
                                            if (sAction == "OK") {
                                                that.extensionAPI.refresh();
                                            }
                                        },
                                    });
                                    pressDialog.close();
                                    that._itemDialogDestroy();
                                    pressDialog.destroy();
                                },
                                error: function (e) {
                                    var MErr = this.getView().getModel("i18n").getResourceBundle();
                                    sap.m.MessageBox.error(MErr.getText("Error"));
                                  
                                },
                            });
                        } else {
                            var BTPCRItem = oData.results[0].BTPCRItem;
                            Attachmentid =
                                oData.results[0].Attachment.results[0].AttachmentId;
                            that.oModel.setUseBatch(true);
                            for (var i = 0; i < removedFileDamage.length; i++) {
                                var sPath = "/AttachmentRow(" + removedFileDamage[i] + ")";
                                that.oModel.remove(sPath, {
                                    method: "POST",
                                    success: function (data) { },
                                    error: function (e) { },
                                });
                            }
                            for (var i = 0; i < removedFileQuality.length; i++) {
                                var sPath = "/AttachmentRow(" + removedFileQuality[i] + ")";
                                that.oModel.remove(sPath, {
                                    method: "POST",
                                    success: function (data) { },
                                    error: function (e) { },
                                });
                            }
                            for (var i = 0; i < removedFileShortage.length; i++) {
                                var sPath = "/AttachmentRow(" + removedFileShortage[i] + ")";
                                that.oModel.remove(sPath, {
                                    method: "POST",
                                    success: function (data) { },
                                    error: function (e) { },
                                });
                            }
                            var Path = "/CreditReqItem" + "(" + BTPCRItem + ")";
                            obj1.Attachment[0]["AttachmentId"] = Attachmentid;
                            that.oModel.update(Path, obj1, {
                                success: function (oData) {
                                    if (oData.Attachment.results.length > 0) {
                                        that.updateAttachmentID(
                                            oData.Attachment.results[0].AttachmentId,
                                            oData.CRType_Id
                                        );
                                    }
                                    var oTable1 = that
                                        .getView()
                                        .byId(
                                            "createstorecr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
                                        );
                                        that.UpdtMsg = that.getView().getModel("i18n").getResourceBundle();
                                        that.UpdtMsg1 = that.UpdtMsg.getText("ItemupdatedCR")
                                      sap.m.MessageBox.success(that.UpdtMsg1 + " " + CRNo + "",
                                        {
                                            actions: [sap.m.MessageBox.Action.OK],
                                            onClose: function (sAction) {
                                                //  MessageToast.show("Action selected: " + sAction);
                                                if (sAction == "OK") {
                                                    that.extensionAPI.refresh();
                                                }
                                            },
                                        }
                                    );
                                    pressDialog.close();
                                    that._itemDialogDestroy();
                                    pressDialog.destroy();
                                },
                                error: function (Error) {
                                    var errorMsg = JSON.parse(Error.responseText).error.message
                                        .value;
                                    sap.m.MessageBox.error(errorMsg);
                                },
                            });
                        }
                    },
                    error: function (Error) {
                        var errorMsg = JSON.parse(Error.responseText).error.message.value;
                        sap.m.MessageBox.error(errorMsg);
                    },
                });
            },
            
            _itemDialogDestroy() {
                File = [];
                removedFileShortage = [];
                removedFileDamage = [];
                removedFileQuality = [];
                uploadedFileDamage = [];
                uploadedFileQuality = [];
                uploadedFileShortage = [];
                if (sap.ui.getCore().byId("idstep") !== undefined) {
                    sap.ui.getCore().byId("idstep").destroy();
                }
                sap.ui.getCore().byId("idcbox").destroy();
                sap.ui.getCore().byId("Expdate").destroy();
                //      sap.ui.getCore().byId("coments").destroy();
                sap.ui.getCore().byId("LotCode").destroy();
                sap.ui.getCore().byId("attachmentUpl").destroy();
                if (sap.ui.getCore().byId("attachmentUpl-uploader") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl-uploader").destroy();
                }
                if (sap.ui.getCore().byId("attachmentUpl-toolbar") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl-toolbar").destroy();
                }
                if (
                    sap.ui.getCore().byId("'attachmentUpl-deleteDialog'") !== undefined
                ) {
                    sap.ui.getCore().byId("'attachmentUpl-deleteDialog'").destroy();
                }
                if (sap.ui.getCore().byId("attachmentUpl-list") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl-list").destroy();
                }
                sap.ui.getCore().byId("attachmentUpl1").destroy();
                if (sap.ui.getCore().byId("attachmentUpl1-uploader") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl1-uploader").destroy();
                }
                if (sap.ui.getCore().byId("attachmentUpl1-toolbar") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl1-toolbar").destroy();
                }
                if (
                    sap.ui.getCore().byId("'attachmentUpl1-deleteDialog'") !== undefined
                ) {
                    sap.ui.getCore().byId("'attachmentUpl1-deleteDialog'").destroy();
                }

                if (sap.ui.getCore().byId("attachmentUpl1-list") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl1-list").destroy();
                }
                sap.ui.getCore().byId("attachmentUpl2").destroy();
                if (sap.ui.getCore().byId("attachmentUpl2-uploader") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl2-uploader").destroy();
                }
                if (sap.ui.getCore().byId("attachmentUpl2-toolbar") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl2-toolbar").destroy();
                }
                if (
                    sap.ui.getCore().byId("attachmentUpl2-deleteDialog") !== undefined
                ) {
                    sap.ui.getCore().byId("attachmentUpl2-deleteDialog").destroy();
                }

                if (sap.ui.getCore().byId("attachmentUpl2-list") !== undefined) {
                    sap.ui.getCore().byId("attachmentUpl2-list").destroy();
                }

                sap.ui.getCore().byId("Damage").destroy();
                sap.ui.getCore().byId("Shortage").destroy();
                this.PISelectedkeys = [];
                var Language= sap.ui.getCore().getConfiguration().getLanguage();

 
 
    sap.ui.getCore().byId("idProductIssueMCB").setSelectedKeys([]);
    //sap.ui.getCore().byId("Quality").getContent()[4].setSelectedKeys([]);
    sap.ui.getCore().byId("Quality").getContent()[4].setValue(null);
    sap.ui.getCore().byId("Quality").getContent()[6].setValue(null);
    sap.ui.getCore().byId("Quality").getContent()[8].setValue(null);
    sap.ui.getCore().byId("Quality").getContent()[11].setValue(null);
    sap.ui.getCore().byId("Quality").getContent()[13].setValue(null);
    sap.ui.getCore().byId("Quality").getContent()[15].setValue(null);
    //sap.ui.getCore().byId("Quality").getContent()[17].setValue(null);

    sap.ui.getCore().byId("Quality").destroy();
    sap.ui.getCore().byId("Idsave").destroy();
  

               
            },

            onProductissue: function (evt) {
                this.PISelectedkeys = sap.ui
                    .getCore()
                    .byId("idProductIssueMCB")
                    .getSelectedKeys();
            },

            _productIssueKeys: function () {
                var Selectedkeys = sap.ui
                    .getCore()
                    .byId("idProductIssueMCB")
                    .getSelectedKeys();
            },

            updateAttachmentID: function (attachmentID, CRType) {
                this.oModel.setUseBatch(true);
                if (CRType === 1) {
                    var uploadedFile = uploadedFileDamage;
                } else if (CRType === 3) {
                    uploadedFile = uploadedFileQuality;
                } else if (CRType === 2) {
                    uploadedFile = uploadedFileShortage;
                }
                else {
                    uploadedFile = [];
                }
                for (var i = 0; i < uploadedFile.length; i++) {
                    var sPath = "/AttachmentRow(" + uploadedFile[i].id + ")";
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
            //End of Function
        };
    }
);
