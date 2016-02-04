(function () {
                    
    var SUBMENU_SHOW_HIDE_DELAY = 400;
    var undefined;
    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;
    var menu_packedData_isInMenuMode_mask = 0x0000001;
    var menu_packedData_shouldOpenOnMouseEnter_mask = 0x0000002;

    // This implementation is incompatible with multiple mouses, although supported by the input and UIElement API.

    var menu_baseTypeName = "UIElement";
    var menu_baseTypeCtor = window[menu_baseTypeName];
    var menu_baseTypeProto = menu_baseTypeCtor.prototype;

    function __Menu() {
        this.__menu_hostElem = null;
        this.__initCommon();
    }
    function Menu(hostElem) {
        this.__initHostElem(hostElem);
        this.__initCommon();
    }
    Menu.prototype = __Menu.prototype = setOwnSrcPropsOnDst({
        __getCurrentSelection: function () {
            return this.__menu_currentSelection;
        },
        __getHasItems: function() {
            return this.__menu_items !== null && 0 < this.__menu_items.getCount();
        },
        __getIsInMenuMode: function () {
            return (this.__menu_packedData & menu_packedData_isInMenuMode_mask) !== 0;
        },
        __getIsNotWithinConstructor: function() {
            return (this.__menu_packedData & menu_packedData_isNotWithinConstructor_mask) !== 0;
        },
        getItems: function () {
            if (this.__menu_items === null) {
                this.__menu_items = new CommonMenuItemList();
                this.__menu_items.__addHandler("listChanged", this.__onItemsChanged, this);
            }
            return this.__menu_items;
        },
        __getShouldOpenOnMouseEnter: function() {
            return (this.__menu_packedData & menu_packedData_shouldOpenOnMouseEnter_mask) !== 0;
        },
        __handleMouseDownUp: function (e) {
            var e_src;
            if (e.getIsHandled()) return;
            if (e.getChangedButton() !== 1 && e.getChangedButton() !== 3) return;
            e_src = e.getSource();
            if (e_src !== this) return;
            this.__setIsInMenuMode(false);
            e.setIsHandled(true);
        },
        __handleMouseDownUpOutsideCaptureUIElement: function (e) {
            if (e.getIsHandled()) return;
            if (e.getChangedButton() !== 1 && e.getChangedButton() !== 3) {
                return;
            }
            this.__setIsInMenuMode(false);
        },
        __initCommon: function () {
            this.__menu_items = null;
            this.__menu_panel = new Panel();
            this.__menu_currentSelection = null;
            this.__menu_packedData = 0;
            menu_baseTypeCtor.call(this);
            this.__menu_panel.__setUIElementTree_parent(this);
        },
        __initHostElem: function(hostElem) {
            this.__menu_hostElem = hostElem;
            hostElement_cssClasses_addRange(this.__menu_hostElem, "menu");
        },
        _onClick: function (e) {
            var r, e_src;
            e_src = e.getSource();
            if (e_src instanceof MenuItem && !e_src.getShouldStayOpenOnClick()) {
                r = e_src.__getRole();
                if ((r & menuItemRole_type_mask) === menuItemRole_type_item) {
                    this.__setIsInMenuMode(false);
                }
            }
        },
        __onItemIsSelectedChanged: function (menuItem) {
            var cs;
            cs = this.__getCurrentSelection();
            if (menuItem.__getIsSelected()) {
                if (cs !== menuItem) {
                    if (cs !== null) {
                        cs.setIsSubmenuOpen(false);
                    }
                    this.__setCurrentSelection(menuItem);
                }
            } else {
                if (cs === menuItem) {
                    this.__setCurrentSelection(null);
                }
            }
        },
        __onItemsChanged: function (sender, e) {
            menuOrMenuItem_onItemsChanged(this, e);
        },
        __onLostMouseCapture: function (e) {
            var md, cUIElem, flag;
            if (e.getIsHandled()) return;
            md = e.getMouseDevice();
            if (md !== MouseDevice.getPrimary()) return;
            cUIElem = md.getCaptureUIElement();
            assert(this !== e.getSource() || cUIElem !== this);
            if (this === e.getSource()) {
                if (cUIElem === null || !cUIElem.uiElementTree_isAncestorOf(this)) {
                    // If the lost mouse capture event was raised because this Menu lost 
                    // mouse capture and this Menu is not a descendant of the UI element 
                    // with capture then exit menu mode.
                    this.__setIsInMenuMode(false);
                }
            } else if (this.uiElementTree_isAncestorOf(e.getSource())) {
                // If the lost mouse capture event was raised because a descendent lost
                // mouse capture then we attempt to recapture the mouse.
                if (this.__getIsInMenuMode() && cUIElem === null && !md.getIsCaptureNotKnownByScriptEnvironment()) {
                    flag = md.setCaptureUIElement(this, "uiElementSubTree");
                    assert(flag);
                    e.setIsHandled(true);
                    return;
                }
            } else {
                this.__setIsInMenuMode(false);
            }

        },
        __onMouseDown: function (e) {
            this.__handleMouseDownUp(e);
        },
        __onMouseUp: function (e) {
            this.__handleMouseDownUp(e);
        },
        __onPreviewMouseDownOutsideCaptureUIElement: function (e) {
            assert(this.getHasMouseCapture(e.getMouseDevice()));
            this.__handleMouseDownUpOutsideCaptureUIElement(e);
        },
        __onPreviewMouseUpOutsideCaptureUIElement: function (e) {
            assert(this.getHasMouseCapture(e.getMouseDevice()));
            this.__handleMouseDownUpOutsideCaptureUIElement(e);
        },
        __setCurrentSelection: function(value) {
            var cs;
            if (value !== null && (!(value instanceof MenuItem) || value.__getLogicalParent() !== this)) throw Error();
            // TODO TRANSFER ANY KEYBOARD FOCUS TO THE NEW ELEMENT!
            cs = this.__getCurrentSelection();
            if (cs !== null) {
                cs.__setIsSelected(false);
            }
            this.__menu_currentSelection = value;
            if (value !== null) {
                value.__setIsSelected(true);
            }
        },
        __setIsInMenuMode: function (value) {
            var mouseDevice_primary, i;
            if (value === this.__getIsInMenuMode()) return;
            if (typeof value !== "boolean") throw Error();
            if (value) {
                this.__menu_packedData |= menu_packedData_isInMenuMode_mask;
                mouseDevice_primary = MouseDevice.getPrimary();
                i = mouseDevice_primary.getCaptureUIElement();
                if ((i === null || (this !== i && !this.uiElementTree_isAncestorOf(i)))
                    && !this.captureMouse(mouseDevice_primary, "uiElementSubTree")) {
                    value = false;
                } 
            }
            if (!value) {
                this.__menu_packedData &= ~menu_packedData_isInMenuMode_mask;
                // Not implemented.
                i = this.__getCurrentSelection();
                if (i !== null) {
                    i.setIsSubmenuOpen(false);
                    this.__setCurrentSelection(null);
                }
                this.releaseMouseCapture();
            }
            this.__setShouldOpenOnMouseEnter(value);
        },
        __setShouldOpenOnMouseEnter: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__menu_packedData = value
                ? (this.__menu_packedData | menu_packedData_shouldOpenOnMouseEnter_mask)
                : (this.__menu_packedData & ~menu_packedData_shouldOpenOnMouseEnter_mask);
        },

        __uiElementTree_appendReversedChildrenToArray: function (array) {
            array[array.length] = this.__menu_panel;
        }
    }, Object.create(menu_baseTypeProto));

    
    var getOptionOnce = JsonMarkup.getOptionOnce;
    var SENTINEL = __menuItemRole_isValid;
    JsonMarkup.__addType("Menu", __Menu, menu_baseTypeName, function (instance, options) {
        var i;
        if (!isHostElement(i = getOptionOnce(options, "hostElement"))) throw Error();
        instance.__initHostElem(i);
        if ((i = getOptionOnce(options, "items", SENTINEL)) !== SENTINEL) {
            menuOrMenuItem_createAndAppendCommonMenuItems_fromCommonMenuItemOptionList(instance, i);
        }
    });



    var menuItemRole_topLevelItem = 0;
    var menuItemRole_topLevelHeader = 1;
    var menuItemRole_submenuItem = 2;
    var menuItemRole_submenuHeader = 3;

    var menuItemRole_isNotTopLevel_mask = 2;
    var menuItemRole_type_mask = 1;
    var menuItemRole_type_header = 1;
    var menuItemRole_type_item = 0;
    var menuItemRole_mask = 3;
    var menuItemRole_toString = [ "topLevelItem", "topLevelHeader", "submenuItem", "submenuHeader" ];
    var __menuItemRole_isValid = function (value) {
        switch (value) {
            case menuItemRole_topLevelItem:
            case menuItemRole_topLevelHeader:
            case menuItemRole_submenuItem:
            case menuItemRole_submenuHeader:
                return true;
        }
        return false;
    };

    var menuItem_roleToCssClass = [ "top-level-item", "top-level-header", "submenu-item", "submenu-header" ];
    var menuItem_packedData_isSubmenuOpen_mask = 0x0000001;
    var menuItem_packedData_hasOwner_mask = 0x0000002;
    var menuItem_packedData_isCheckable_mask = 0x0000004;
    var menuItem_packedData_isChecked_mask = 0x0000008;
    var menuItem_packedData_shouldStayOpenOnClick_mask = 0x000010;
    var menuItem_packedData_isSelected_mask = 0x0000020;
    var menuItem_packedData_isHighlighted_mask = 0x0000040;
    var menuItem_packedData_isPressed_mask = 0x0000080;
    var menuItem_packedData_role_offset = 8;
    var menuItem_packedData_role_mask = menuItemRole_mask << menuItem_packedData_role_offset;
                      
    var menuItem_baseTypeName = "UIElement";
    var menuItem_baseTypeCtor = window[menuItem_baseTypeName];
    var menuItem_baseTypeProto = menuItem_baseTypeCtor.prototype;

    function MenuItem() {
        this.__menuItem_packedData = 0;
        this.__menuItem_items = null;
        this.__menuItem_header = null;
        this.__menuItem_currentSelection = null;
        this.__menuItem_uiElemSubmenu = null;
        this.__menuItem_hostElemMenuItem = null;
        this.__menuItem_hostElemMenuItemHeader = null;
        this.__menuItem_hostElemInnerSubmenu = null;
        this.__menuItem_hostElemOuterSubmenu = null;
        this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutFunc = null;
        this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId = null;
        this.__menuItem_closeSubmenu_timeoutFunc = null;
        this.__menuItem_closeSubmenu_timeoutId = null;
        menuItem_baseTypeCtor.call(this);
    }
    MenuItem.prototype = setOwnSrcPropsOnDst({
        __clickHeader: function () {
            var lp;
            this.__focusOrSelect();
            if (this.getIsSubmenuOpen()) {
                if (this.__getRole() === menuItemRole_topLevelHeader) {
                    lp = this.__getLogicalParent();
                    assert(lp instanceof Menu);
                    lp.__setIsInMenuMode(false);
                    return;
                }
            } else {
                this.__openSubmenu();
            }
        },
        __clickItem: function () {
            var uiElements;
            uiElements = this.getUIElementTree_selfAndAncestors();
            this.__raiseEvent(new __RoutedEvent(uiElements, false, "click", "Click", new RoutedEventArgs()));
        },
        __closeSubmenu_timer_onTick: function () {
            this.__menuItem_closeSubmenu_timeoutId = null;
            this.__setIsSelected(false);
        },
        __closeSubmenu_timer_set: function () {
            if (this.__menuItem_closeSubmenu_timeoutFunc === null) {
                this.__menuItem_closeSubmenu_timeoutFunc = this.__closeSubmenu_timer_onTick.bind(this);
            } else if (this.__menuItem_closeSubmenu_timeoutId !== null) {
                clearTimeout(this.__menuItem_closeSubmenu_timeoutId);
            }
            this.__menuItem_closeSubmenu_timeoutId = setTimeout(
                this.__menuItem_closeSubmenu_timeoutFunc, SUBMENU_SHOW_HIDE_DELAY);
        },
        __closeSubmenu_timer_stop: function() {
            if (this.__menuItem_closeSubmenu_timeoutId === null) return;
            clearTimeout(this.__menuItem_closeSubmenu_timeoutId);
            this.__menuItem_closeSubmenu_timeoutId = null;
        },
        __focusOrSelect: function() {
            this.__setIsSelected(true);
            this.__setIsHighlighted(true);
        },
        __getCurrentSelection: function() {
            return this.__menuItem_currentSelection;
        },
        __getCurrentSibling: function () {
            var lp, lp_curSel;
            lp = this.__getLogicalParent();
            if ((lp instanceof MenuItem || lp instanceof Menu)
                && (lp_curSel = lp.__getCurrentSelection()) !== this) {
                return lp_curSel;
            }
            return null;
        },
        __getHasItems: function() {
            var i;
            i = this.__menuItem_items;
            return i !== null && 0 < i.getCount();
        },
        __getHasOwner: function() {
            return (this.__menuItem_packedData & menuItem_packedData_hasOwner_mask) !== 0;
        },
        getHeader: function () {
            return this.__menuItem_header;
        },
        getIsCheckable: function() {
            return (this.__menuItem_packedData & menuItem_packedData_isCheckable_mask) !== 0;
        },
        getIsChecked: function () {
            return (this.__menuItem_packedData & menuItem_packedData_isChecked_mask) !== 0;
        },
        getIsHighlighted: function() {
            return (this.__menuItem_packedData & menuItem_packedData_isHighlighted_mask) !== 0;
        },
        getIsPressed: function() {
            return (this.__menuItem_packedData & menuItem_packedData_isPressed_mask) !== 0;
        },
        getIsSubmenuOpen: function() {
            return (this.__menuItem_packedData & menuItem_packedData_isSubmenuOpen_mask) !== 0;
        },
        __getIsSelected: function() {
            return (this.__menuItem_packedData & menuItem_packedData_isSelected_mask) !== 0;
        },
        getItems: function () {
            if (this.__menuItem_items === null) {
                this.__menuItem_items = new CommonMenuItemList();
                this.__menuItem_items.__addHandler("listChanged", this.__onItemsChanged, this);
            }
            return this.__menuItem_items;
        },
        __getLogicalParent: function() {
            var lp;
            lp = this.getUIElementTree_parent();
            if (lp !== null && !(lp instanceof MenuItem || lp instanceof Menu)) {
                lp = lp.getUIElementTree_parent();
            }
            return lp;
        },
        __getMenuItemHostElem: function () {
            var cssClasses, i;
            if (this.__menuItem_hostElemMenuItem !== null) return this.__menuItem_hostElemMenuItem;
            cssClasses = ["menu-item", menuItem_roleToCssClass[this.__getRole()]];
            i = 2;
            if (this.getIsCheckable()) cssClasses[i++] = "is-checkable";
            if (this.getIsChecked()) cssClasses[i++] = "is-checked";
            if (this.getIsHighlighted()) cssClasses[i++] = "is-highlighted";
            if (this.getIsMouseOver()) cssClasses[i++] = "is-mouse-over";
            if (this.getIsMouseDirectlyOver()) cssClasses[i++] = "is-mouse-directly-over";
            this.__menuItem_hostElemMenuItem = document.createElement("div");
            hostElement_cssClasses_addRange(this.__menuItem_hostElemMenuItem, cssClasses);
            i = document.createElement("span");
            hostElement_cssClasses_addRange(i, "menu-item-check");
            this.__menuItem_hostElemMenuItem.appendChild(i);
            this.__menuItem_hostElemMenuItemHeader = document.createElement("span");
            hostElement_cssClasses_addRange(this.__menuItem_hostElemMenuItemHeader, "menu-item-header");
            if (this.__menuItem_header !== null) this.__menuItem_hostElemMenuItemHeader.innerText = this.__menuItem_header;
            this.__menuItem_hostElemMenuItem.appendChild(this.__menuItem_hostElemMenuItemHeader);

            i = document.createElement("span");
            hostElement_cssClasses_addRange(i, "menu-item-arrow");
            this.__menuItem_hostElemMenuItem.appendChild(i);

            hostObject_initializeData(this.__menuItem_hostElemMenuItem).uiElement = this;
            return this.__menuItem_hostElemMenuItem;
        },
        getRole: function() {
            return menuItemRole_toString[this.__getRole()];
        },
        __getRole: function () {
            return (this.__menuItem_packedData & menuItem_packedData_role_mask) >> menuItem_packedData_role_offset;
        },
        getShouldStayOpenOnClick: function() {
            return (this.__menuItem_packedData & menuItem_packedData_shouldStayOpenOnClick_mask) !== 0;
        },
        __initializeHostElemSubmenu: function() {
            var outerList, innerList, shadow;
            var items, i, n;
            var hostUtilities, docNode;
            hostUtilities = HostUtilities.fromHostContext(window);
            docNode = hostUtilities.getDocNode();
            outerList = hostElement_cssClasses_addRange(docNode.createElement("div"), "menu-item-list-outer");
            shadow = hostElement_cssClasses_addRange(docNode.createElement("div"), "menu-item-list-shadow");
            outerList.appendChild(shadow);
            innerList = hostElement_cssClasses_addRange(docNode.createElement("div"), "menu-item-list-inner");
            items = this.__menuItem_items;
            assert(items !== null);
            for (i = 0, n = items.getCount() ; i < n; i++) {
                innerList.appendChild(commonMenuItem_getHostElement(items.get(i)));
            }
            outerList.appendChild(innerList);
            this.__menuItem_hostElemInnerSubmenu = innerList;
            this.__menuItem_hostElemOuterSubmenu = outerList;
            outerList.style.visibility = "hidden";
            hostObject_initializeData(outerList).uiElement = this.__menuItem_uiElemSubmenu;
            hostUtilities.getBodyElem().appendChild(outerList);
        },
        _onClick: function (e) {
            if (this.getIsCheckable() && !e.getIsHandled()) {
                this.setIsChecked(!this.getIsChecked());
                e.setIsHandled(true);
            } 
        },
        __onIsSubmenuOpenChanged: function () {
            var logicalParent, cs, role;
            var hostElemOuterSubmenu;
            this.__openSubmenuIfThisRoleTypeIsHeader_timer_stop();
            this.__closeSubmenu_timer_stop();
            if (this.getIsSubmenuOpen()) {
                role = this.__getRole();
                if (role === menuItemRole_topLevelHeader) {
                    logicalParent = this.__getLogicalParent();
                    if (logicalParent instanceof Menu) {
                        logicalParent.__setIsInMenuMode(true);
                    }                
                }
                this.__setCurrentSelection(null);
                // Initialize and position submenu, if necessary
                if ((role & menuItemRole_type_mask) === menuItemRole_type_header) {
                    hostElemOuterSubmenu = this.__menuItem_hostElemOuterSubmenu;
                    if (hostElemOuterSubmenu === null) {
                        this.__initializeHostElemSubmenu();
                        hostElemOuterSubmenu = this.__menuItem_hostElemOuterSubmenu;
                    } else {
                        hostElemOuterSubmenu.style.visibility = "hidden";
                        hostElemOuterSubmenu.style.display = "";
                    }
                    this.__updateSubmenuPosition();
                    hostElemOuterSubmenu.style.visibility = "";
                }
            } else {
                cs = this.__getCurrentSelection();
                if (cs !== null) {
                    cs.setIsSubmenuOpen(false);
                }
                this.__setCurrentSelection(null);

                hostElemOuterSubmenu = this.__menuItem_hostElemOuterSubmenu;
                if (hostElemOuterSubmenu !== null) {
                    hostElemOuterSubmenu.style.display = "none";
                }
            }
        },
        __onItemIsSelectedChanged: function (menuItem) {
            var cs;
            cs = this.__getCurrentSelection();
            if (menuItem.__getIsSelected()) {
                if (cs === menuItem) {
                    this.__closeSubmenu_timer_stop();
                }
                if (cs !== menuItem) {
                    if (cs !== null) {
                        cs.setIsSubmenuOpen(false);
                    }
                    this.__setCurrentSelection(menuItem);
                }
            } else {
                if (cs === menuItem) {
                    this.__setCurrentSelection(null);
                }
            }
        },
        __onItemsChanged: function (sender, e) {
            var hostElemInnerSubmenu;
            hostElemInnerSubmenu = this.__menuItem_hostElemInnerSubmenu;
            switch (e.getType()) {
                case "reset": throw Error();
                case "insert":
                    if (this.__menuItem_uiElemSubmenu === null) {
                        this.__menuItem_uiElemSubmenu = new Panel();
                        this.__menuItem_uiElemSubmenu.__setUIElementTree_parent(this);
                    }
                    break;
                case "remove":
                    if (this.__menuItem_items.getCount() === 0) {
                        if (hostElemInnerSubmenu !== null) {
                            this.__menuItem_uiElemSubmenu.getChildren().clear();
                            hostElement_childNodes_clear(hostElemInnerSubmenu);
                            hostElement_setParentToNull(this.__menuItem_hostElemOuterSubmenu);
                            hostObject_deleteData(this.__menuItem_hostElemOuterSubmenu);
                            this.__menuItem_hostElemInnerSubmenu = null;
                            this.__menuItem_hostElemOuterSubmenu = null;
                        }
                        return;
                    }
                    break;
                case "insertFollowedByRemove": break;
                default:
                    throw Error(); 
            }
            menuOrMenuItem_onItemsChanged(this, e);
            this.__updateRole();
        },    
        __onMouseDown: function (e) {
            var rect_vp;
            if (e.getIsHandled()) return;
            // Behavior is based on Windows (WPF).
            rect_vp = hostElement_getRect_viewport(this.__menuItem_hostElemMenuItem);
            if (rect_vp.contains(e.getPosition_viewport())
                && e.getChangedButton() === 1) {
                this.__clickHeader();
            }
            e.setIsHandled(true);
            if (e.getChangedButton() === 1) {
                this.__updateIsPressed();
            }
        },
        __onMouseEnter: function() {
            var lp, lp_isMenu, role, curSibling;
            assert(this.getIsMouseOver());
            lp = this.__getLogicalParent();
            lp_isMenu = false;
            if (lp === null
                || ((lp_isMenu = (lp instanceof MenuItem) || lp instanceof Menu)
                    && !menuOrMenuItem_getShouldIgnoreMouseEvents(lp))) {
                role = this.__getRole();
                if (((role & menuItemRole_isNotTopLevel_mask) === 0
                        && lp_isMenu && lp.__getShouldOpenOnMouseEnter())
                    || (role & menuItemRole_isNotTopLevel_mask) !== 0) {
                    switch (role) {
                        case menuItemRole_topLevelHeader:
                        case menuItemRole_topLevelItem:
                            if (!this.getIsSubmenuOpen()) {
                                this.__openSubmenuIfRoleTypeIsHeader(role);
                            }
                            break;
                        case menuItemRole_submenuHeader:
                        case menuItemRole_submenuItem:
                            curSibling = this.__getCurrentSibling();
                            if (curSibling === null || !curSibling.getIsSubmenuOpen()) {
                                if (!this.getIsSubmenuOpen()) {
                                    this.__focusOrSelect();
                                } else {
                                    this.__setIsHighlighted(true);
                                }
                            } else {
                                curSibling.__setIsHighlighted(false);
                                this.__setIsHighlighted(true);
                            }
                            if (!this.__getIsSelected() || !this.getIsSubmenuOpen()) {
                                this.__openSubmenuIfThisRoleTypeIsHeader_timer_set();
                            }
                            break;
                        default:
                            throw Error();
                    }
                    this.__closeSubmenu_timer_stop();
                } else {
                    this.__setIsSelected(true);
                }
                this.__updateIsPressed();
                return;
            }
            // TODO add mouseEnterOnMouseMove
        },
        __onMouseLeave: function () {
            var lp, role;
            lp = this.__getLogicalParent();
            role = this.__getRole();
            if (((role & menuItemRole_isNotTopLevel_mask) === 0 && lp instanceof Menu && lp.__getIsInMenuMode())
                || (role & menuItemRole_isNotTopLevel_mask) !== 0) {
                if ((role & menuItemRole_isNotTopLevel_mask) !== 0) {
                    if (!this.getIsSubmenuOpen()) {
                        if (this.__getIsSelected()) {
                            this.__setIsSelected(false);
                        } else {
                            this.__setIsHighlighted(false);
                        }
                    } else if (this.__onMouseLeave_getIsMouseOverSibling()) {
                        this.__closeSubmenu_timer_set();
                    }
                }
                this.__openSubmenuIfThisRoleTypeIsHeader_timer_stop();
            } else {
                assert(!this.getIsMouseOver());
                this.__setIsSelected(false);
            }
            this.__updateIsPressed();
        },
        __onMouseLeave_getIsMouseOverSibling: function () {
            var lp, dirOverUIElem, i;
            // We may assume the submenu of this item is opened.
            // Let m either be a Menu or MenuItem.
            // Of all MenuItems that are a logical child of m, there 
            // can only be one with its submenu open.
            // From this it follows that for all MenuItem siblings s of this, 
            // if s.getIsMouseOver() is true then the mouse is not over the 
            // submenu of s. Note that we cannot use s.getIsMouseOver() here, 
            // since it will not have been updated yet. The only property we can 
            // use to decide if s.getIsMouseOver() will be set to true 
            // within the parent call to MouseDevice.setDirectlyOverUIElement is 
            // MouseDevice.getDirectlyOverUIElement.
            // Thus we have to compute whether MouseDevice.getDirectlyOverUIElement() is 
            // within the logical parent (which must be a MenuItem or Menu) of this
            // and if it is (within) a sibling s. 
            // Why does mouse capture not make this algorithm incorrect?
            lp = this.__getLogicalParent();
            if (!(lp instanceof Menu || lp instanceof MenuItem)) throw Error();
            dirOverUIElem = MouseDevice.getPrimary().getDirectlyOverUIElement();
            if (lp === dirOverUIElem || null === dirOverUIElem) return false;
            if (!lp.uiElementTree_isAncestorOf(dirOverUIElem)) return false;
            i = dirOverUIElem;
            do {
                if (i instanceof MenuItem) {
                    assert(i !== this);
                    if (i.__getLogicalParent() === lp) {
                        return true;
                    }
                }
            } while ((i = i.getUIElementTree_parent()) !== lp);
            return false;
        },
        __onMouseUp: function (e) {
            var role, lp;
            if (e.getIsHandled()) return;
            if (e.getChangedButton() === 1) {
                this.__updateIsPressed();
            }
            if (this.__menuItem_hostElemMenuItem !== null
                && hostElement_getRect_viewport(this.__menuItem_hostElemMenuItem).contains(e.getPosition_viewport())
                && e.getChangedButton() === 1) {
                role = this.__getRole();
                if ((role & menuItemRole_type_mask) === menuItemRole_type_item) {
                    try {
                        this.__clickItem();
                    } finally {
                        if (role === menuItemRole_topLevelItem && !this.getShouldStayOpenOnClick()) {
                            lp = this.__getLogicalParent();
                            if (lp instanceof Menu) lp.__setIsInMenuMode(false);
                        }
                    }
                }
            }
            if (e.getChangedButton() === 1) {
                e.setIsHandled(true);
            }
        },
        __onPropertyChanged: function (e) {
            var i;
            menuItem_baseTypeProto.__onPropertyChanged.call(this, e);
            i = this.__menuItem_hostElemMenuItem;
            switch (e.getPropertyName()) {
                case "isCheckable":
                    if (i !== null) hostElement_setHasCssClass(i, "is-checkable", e.getNewValue());
                    this.__updateRole();
                    break;
                case "isChecked":
                    if (i !== null) hostElement_setHasCssClass(i, "is-checked", e.getNewValue());
                    break;
                case "isHighlighted":
                    if (i !== null) hostElement_setHasCssClass(i, "is-highlighted", e.getNewValue());
                    break;
                case "isMouseDirectlyOver":
                    if (i !== null) hostElement_setHasCssClass(i, "is-mouse-directly-over", e.getNewValue());
                    break;
                case "isMouseOver":
                    if (i !== null) hostElement_setHasCssClass(i, "is-mouse-over", e.getNewValue());
                    if (e.getNewValue()) {
                        this.__onMouseEnter();
                    } else {
                        this.__onMouseLeave();
                    }
                    break;
                case "isPressed":
                    if (i !== null) hostElement_setHasCssClass(i, "is-pressed", e.getNewValue());
                    break;
                case "isSubmenuOpen":
                    this.__onIsSubmenuOpenChanged();
                    break;
            }
        },
        __onUIElementTree_ancestorsChanged: function(e) {
            // Overkill solution, until we have a more specific event!
            this.__updateRole();
        },
        __openSubmenu: function () {
            var thisLogicalParent = this.__getLogicalParent();
            if (thisLogicalParent instanceof MenuItem
                || thisLogicalParent instanceof Menu) {
                this.setIsSubmenuOpen(true);
            }
        },
        __openSubmenuIfRoleTypeIsHeader: function (role) {
            this.__focusOrSelect();
            if ((role & menuItemRole_type_mask) === menuItemRole_type_header) {
                this.__openSubmenu();
            }
        },
        __openSubmenuIfThisRoleTypeIsHeader_timer_onTick: function () {
            this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId = null;
            this.__openSubmenuIfRoleTypeIsHeader(this.__getRole());
        },
        __openSubmenuIfThisRoleTypeIsHeader_timer_set: function () {
            if (this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutFunc === null) {
                this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutFunc =
                    this.__openSubmenuIfThisRoleTypeIsHeader_timer_onTick.bind(this);
            } else if (this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId !== null) {
                clearTimeout(this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId);
            }
            this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId = setTimeout(
                this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutFunc, SUBMENU_SHOW_HIDE_DELAY);
        },
        __openSubmenuIfThisRoleTypeIsHeader_timer_stop: function () {
            if (this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId !== null) {
                clearTimeout(this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId);
                this.__menuItem_openSubmenuIfThisRoleTypeIsHeader_timeoutId = null;
            }
        },
        __setCurrentSelection: function (value) {
            if (value !== null && (!(value instanceof MenuItem) || value.__getLogicalParent() !== this)) throw Error();
            if (this.__menuItem_currentSelection === value) return;
            if (this.__menuItem_currentSelection !== null) {
                this.__menuItem_currentSelection.__setIsSelected(false);
            }
            this.__menuItem_currentSelection = value;
            if (this.__menuItem_currentSelection !== null) {
                this.__menuItem_currentSelection.__setIsSelected(true);
            }
        },
        __setHasOwner: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_hasOwner_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_hasOwner_mask);
        },
        setHeader: function (value) {
            var oldValue;
            if (value !== null && typeof value !== "string") throw Error();
            oldValue = this.__menuItem_header;
            if (oldValue === value) return;
            this.__menuItem_header = value;
            if (this.__menuItem_hostElemMenuItemHeader !== null) {
                this.__menuItem_hostElemMenuItemHeader.innerText = (value === null ? "" : value);
            }
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("header", oldValue, value));
        },
        setIsCheckable: function (value) {
            if (this.getIsCheckable() === value) return;
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isCheckable_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_isCheckable_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isCheckable", !value, value));
        },
        setIsChecked: function (value) {
            if (this.getIsChecked() === value) return;
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isChecked_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_isChecked_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isChecked", !value, value));
        },
        __setIsHighlighted: function (value) {
            if (this.getIsHighlighted() === value) return;
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isHighlighted_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_isHighlighted_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isHighlighted", !value, value));
        },
        __setIsPressed: function(value) {
            if (typeof value !== "boolean") throw Error();
            if (value === this.getIsPressed()) return;
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isPressed_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_isPressed_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isPressed", !value, value));
        },
        setIsSubmenuOpen: function (value) {
            if (this.getIsSubmenuOpen() === value) return;
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isSubmenuOpen_mask) 
                : (this.__menuItem_packedData & ~menuItem_packedData_isSubmenuOpen_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isSubmenuOpen", !value, value));
        },
        __setIsSelected: function (value) {
            var lp;
            if (typeof value !== "boolean") throw Error();
            if (value === this.__getIsSelected()) return;
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_isSelected_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_isSelected_mask);
            this.__setIsHighlighted(value);
            if (!value) {
                this.setIsSubmenuOpen(false);
                this.__closeSubmenu_timer_stop();
                this.__openSubmenuIfThisRoleTypeIsHeader_timer_stop();
            }
            lp = this.__getLogicalParent();
            if (lp instanceof Menu || lp instanceof MenuItem) {
                lp.__onItemIsSelectedChanged(this);
            }
        },
        setShouldStayOpenOnClick: function (value) {
            if (value === this.getShouldStayOpenOnClick()) return;
            if (typeof value !== "boolean") throw Error();
            this.__menuItem_packedData = value
                ? (this.__menuItem_packedData | menuItem_packedData_shouldStayOpenOnClick_mask)
                : (this.__menuItem_packedData & ~menuItem_packedData_shouldStayOpenOnClick_mask);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("shouldStayOpenOnClick", !value, value));
        },
        __uiElementTree_appendReversedChildrenToArray: function (array) {
            if (this.__menuItem_uiElemSubmenu !== null) {
                array[array.length] = this.__menuItem_uiElemSubmenu;
            }
        },
        __updateIsPressed: function () {
            var md;
            md = MouseDevice.getPrimary();
            this.__setIsPressed(
                md.getLeftButtonState() === "pressed"
                && this.getIsMouseOver()
                && this.__menuItem_hostElemMenuItem !== null
                && hostElement_getRect_viewport(this.__menuItem_hostElemMenuItem).contains(md.getPosition_viewport()));
        },
        __updateRole: function () {
            var i, role1, role2;
            i = this.__getLogicalParent() instanceof Menu;
            if (this.__getHasItems() && !this.getIsCheckable()) {
                if (i) {
                    role1 = menuItemRole_topLevelHeader;
                } else {
                    role1 = menuItemRole_submenuHeader;
                }
            } else {
                if (i) {
                    role1 = menuItemRole_topLevelItem;
                } else {
                    role1 = menuItemRole_submenuItem;
                }
            }
            role2 = this.__getRole();
            if (role2 === role1) return;
            this.__menuItem_packedData = (this.__menuItem_packedData & ~menuItem_packedData_role_mask) | (role1 << menuItem_packedData_role_offset);
            i = this.__menuItem_hostElemMenuItem;
            if (i !== null) {
                hostElement_cssClasses_removeRange(i, menuItem_roleToCssClass[role2]);
                hostElement_cssClasses_addRange(i, menuItem_roleToCssClass[role1]);
            }
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("role", menuItemRole_toString[role2], menuItemRole_toString[role1]));
        },
        __updateSubmenuPosition: function () {
            var logicalParent;
            var heItem;
            var menuPlacement;
            var menuPlacement_offsetX = -3;
            var menuPlacement_offsetY = 0;
            var menuPlacement_heRelToVert;
            var menuPlacement_heRelToVert_vpRect;
            var menuPlacement_heRelToHoriz;
            var menuPlacement_heRelToHoriz_vpRect;
            heItem = this.__menuItem_hostElemMenuItem;

            logicalParent = this.__getLogicalParent();
            if (logicalParent === null) throw Error();

            // Right positioning
            assert((logicalParent instanceof Menu || logicalParent instanceof MenuItem) && logicalParent.__getHasItems());
            assert((commonMenuItem_getHostElement(logicalParent.getItems().get(0)) === heItem) === (heItem.previousSibling === null));
            assert(!(logicalParent instanceof MenuItem) || logicalParent.__menuItem_hostElemOuterSubmenu !== null);
            if (logicalParent instanceof MenuItem) {
                menuPlacement = "right";
                menuPlacement_heRelToVert = heItem.previousSibling === null
                    ? logicalParent.__menuItem_hostElemOuterSubmenu
                    : heItem;
            } else {
                assert(logicalParent instanceof Menu);
                menuPlacement = "bottom";
                menuPlacement_heRelToVert = heItem;
            }
            menuPlacement_heRelToHoriz = heItem;
            menuPlacement_heRelToHoriz_vpRect = hostElement_getRect_viewport(heItem);
            menuPlacement_heRelToVert_vpRect = menuPlacement_heRelToVert === menuPlacement_heRelToHoriz
                ? menuPlacement_heRelToHoriz_vpRect
                : hostElement_getRect_viewport(menuPlacement_heRelToVert);

            var heSubmenu, heSubmenu_vpRect, vpSize;
            heSubmenu = this.__menuItem_hostElemOuterSubmenu;
            assert(heSubmenu !== null);
            heSubmenu_vpRect = new Rect2D(0, 0, heSubmenu.offsetWidth, heSubmenu.offsetHeight);
            hostUtilities = HostUtilities.fromHostElement(heItem);
            vpSize = hostUtilities.getSize_viewport();
            if (menuPlacement === "right") {
                heSubmenu_vpRect.setX(menuPlacement_heRelToHoriz_vpRect.getRight() + menuPlacement_offsetX);
                if (vpSize.getX() < heSubmenu_vpRect.getRight()) {
                    // The menu is too far to the right, try placing it on the left instead.
                    heSubmenu_vpRect.setX(menuPlacement_heRelToHoriz_vpRect.getX() - heSubmenu_vpRect.getWidth());
                }
                heSubmenu_vpRect.setY(menuPlacement_heRelToVert_vpRect.getY());
                if (vpSize.getY() < heSubmenu_vpRect.getBottom()) {
                    // The menu is too far to the bottom, align its bottom with the bottom of the viewport.
                    heSubmenu_vpRect.setY(vpSize.getY() - heSubmenu_vpRect.getHeight());
                }
            } else if (menuPlacement === "bottom") {
                heSubmenu_vpRect.setY(menuPlacement_heRelToVert_vpRect.getBottom() + menuPlacement_offsetY);
                if (vpSize.getY() < heSubmenu_vpRect.getBottom()) {
                    heSubmenu_vpRect.setY(menuPlacement_heRelToVert_vpRect.getY() - heSubmenu_vpRect.getHeight());
                }
                heSubmenu_vpRect.setX(menuPlacement_heRelToHoriz_vpRect.getX());
                if (vpSize.getX() < heSubmenu_vpRect.getRight()) {
                    heSubmenu_vpRect.setX(vpSize.getX() - heSubmenu_vpRect.getWidth());
                }
            } else {
                throw Error();
            }
            var v = heSubmenu_vpRect.getTopLeft();
            hostUtilities.transform_viewportToViewportContent(v);
            hostUtilities.transform_viewportContentToBodyElemContent(v);
            

            heSubmenu.style.left = v.getX() + "px";
            heSubmenu.style.top = v.getY() + "px";

        }
    }, Object.create(menuItem_baseTypeProto));
    JsonMarkup.__addType("MenuItem", MenuItem, menuItem_baseTypeName, function (instance, options) {

        var i;
        if ((i = getOptionOnce(options, "header", SENTINEL)) !== SENTINEL) instance.setHeader(i);
        if ((i = getOptionOnce(options, "isCheckable", SENTINEL)) !== SENTINEL) instance.setIsCheckable(i);
        if ((i = getOptionOnce(options, "isChecked", SENTINEL)) !== SENTINEL) instance.setIsChecked(i);
        if ((i = getOptionOnce(options, "shouldStayOpenOnClick", SENTINEL)) !== SENTINEL) instance.setShouldStayOpenOnClick(i);
        if ((i = getOptionOnce(options, "items", SENTINEL)) !== SENTINEL) {
            menuOrMenuItem_createAndAppendCommonMenuItems_fromCommonMenuItemOptionList(instance, i);
        }
    }, function (instance, options) {
        var i;
        if ((i = getOptionOnce(options, "command", SENTINEL)) !== SENTINEL) {
            if (!isFunction(i)) throw Error();
            instance.addHandler("click", i);
        }

    });

    function Separator() {
        this.__separator_hostElem = null;
        this.__separator_hasOwner = false;
        UIElement.call(this);
    }
    Separator.prototype = setOwnSrcPropsOnDst({
        __getHostElem: function () {
            if (this.__separator_hostElem !== null) return this.__separator_hostElem;
            this.__separator_hostElem = document.createElement("div");
            hostElement_cssClasses_addRange(this.__separator_hostElem, "separator");
            this.__separator_hostElem.appendChild(document.createElement("div"));
            return this.__separator_hostElem;
        }
    }, UIElement.prototype);
    JsonMarkup.__addType("Separator", Separator, "UIElement");

    function commonMenuItem_isValid(value) {
        if (value instanceof MenuItem) {
            return !value.__getHasOwner();
        }
        if (value instanceof Separator) {
            return !value.__separator_hasOwner;
        }
        return false;
    }

    function commonMenuItem_getHostElement(item) {
        if (item instanceof MenuItem) {
            return item.__getMenuItemHostElem();
        } else if (item instanceof Separator) {
            return item.__getHostElem();
        } else {
            throw Error();
        }
    }

    function menuOrMenuItem_getShouldIgnoreMouseEvents(menuOrMenuItem) {
        return false;
    }

    function menuOrMenuItem_onItemsChanged(menuOrMenuItem, e) {
        var i, n;
        var newItems, newIndex;
        var itemsHostUIElem;
        var itemsHostHostElem;
        if (menuOrMenuItem instanceof Menu) {
            itemsHostUIElem = menuOrMenuItem.__menu_panel;
            itemsHostHostElem = menuOrMenuItem.__menu_hostElem;
        } else {
            itemsHostUIElem = menuOrMenuItem.__menuItem_uiElemSubmenu;
            itemsHostHostElem = menuOrMenuItem.__menuItem_hostElemInnerSubmenu;
        }
        i = e.getOldIndex();
        if (0 <= i) {
            n = e.getOldItems_count();
            itemsHostUIElem.getChildren().removeRange(i, n);
            if (itemsHostHostElem !== null) {
                hostElement_childNodes_removeRange(itemsHostHostElem, i, n);
            }
        }
        newIndex = e.getNewIndex();
        if (0 <= newIndex) {
            newItems = e.__newItems;
            itemsHostUIElem.getChildren().insertRange(newItems, newIndex);
            if (itemsHostHostElem !== null) {
                for (i = 0, n = newItems.length; i < n; i++) {
                    hostElement_childNodes_insert(itemsHostHostElem, newIndex + i, commonMenuItem_getHostElement(newItems[i]));
                }
            }
        }
    }

    JsonMarkup.__addType("__CommonMenuItem", null, null, function (options) {
        var key;
        var aliasedTypeName;
        for (key in options) if (hasOwnPropertyFunction.call(options, key)) {
            switch (key) {
                case "header":
                case "command":
                case "isCheckable":
                case "isChecked":
                case "items":
                case "shouldStayOpenOnClick":
                    aliasedTypeName = "MenuItem";
                    break;
                // add cases for which to use separator
            }
        }
        if (aliasedTypeName === undefined) {
            aliasedTypeName = "Separator";
        }
        return aliasedTypeName;
    }, null, true);

    function menuOrMenuItem_createAndAppendCommonMenuItems_fromCommonMenuItemOptionList(menuOrMenuItem, commonMenuItemOptionList) {
        var i, n;
        var commonMenuItem;
        var commonMenuItemOption;
        if (!isArrayLike_nonSparse(commonMenuItemOptionList)) throw Error();
        for (i = 0, n = commonMenuItemOptionList.length; i < n; i++) {
            commonMenuItemOption = commonMenuItemOptionList[i];
            if (isObject(commonMenuItemOption) && hasOwnPropertyFunction.call(commonMenuItemOption, "type")) {
                commonMenuItem = JsonMarkup.convertToObject(commonMenuItemOption);
            } else {
                commonMenuItem = JsonMarkup.convertToObject(commonMenuItemOption, "__CommonMenuItem");
            }
            menuOrMenuItem.getItems().add(commonMenuItem);
        }
    }

    function commonMenuItem_setHasOwner(item, value) {
        if (item instanceof MenuItem) {
            item.__setHasOwner(value);
        } else if (item instanceof Separator) {
            item.__separator_hasOwner = value;
        } else {
            throw Error();
        }
    }

    function CommonMenuItemList() {
        List.call(this, {
            isItemValid: commonMenuItem_isValid,
            canUseResetListChangeType: false
        });
    }
    CommonMenuItemList.prototype = setOwnSrcPropsOnDst({
        __onListChanged: function (e) {
            var items, i, n;
            if (0 <= e.getOldIndex()) {
                items = e.__oldItems;
                for (n = items.length, i = 0; i < n; i++) {
                    commonMenuItem_setHasOwner(items[i], false);
                }
            }
            if (0 <= e.getNewIndex()) {
                items = e.__newItems;
                for (n = items.length, i = 0; i < n; i++) {
                    commonMenuItem_setHasOwner(items[i], true);
                }
            }
        }
    }, Object.create(List.prototype));




    setOwnSrcPropsOnDst({
        Menu: Menu,
        MenuItem: MenuItem,
        Separator: Separator
    }, window);

})();