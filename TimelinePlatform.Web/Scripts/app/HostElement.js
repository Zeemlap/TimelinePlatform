(function () {

    function Box(value) {
        this.value = value;
    }
    function DelimitedTokenString_containsDelimiter(str) {
        return /[ \r\n\f\t]/.test(str);
    }
    function DelimitedTokenString_indexOf(s, token, isDelimiterFunction) {
        var scan_beg, i, t1;
        scan_beg = 0;
        while (true) {
            i = s.indexOf(token, scan_beg);
            if (i < 0) {
                return -1;
            }
            t1 = i + token.length;
            if ((i === 0 || isDelimiterFunction(s.charCodeAt(i - 1))) &&
                (t1 === s.length || isDelimiterFunction(s.charCodeAt(t1)))) {
                return i;
            }
            scan_beg = t1 + 1;
        }
    }
    function DelimitedTokenString_removeAll(s_in, token, isDelimiterFunction, changedFlag) {
        var i;
        var scan_beg;
        var t1;
        var s_curSectionToRetain_beg;
        var s_out;
        // Assume token is a string with length greater than one.
        s_out = "";
        scan_beg = 0;
        s_curSectionToRetain_beg = 0;
        while (true) {
            i = s_in.indexOf(token, scan_beg);
            if (i < 0) {
                changedFlag.value = (0 < s_curSectionToRetain_beg);
                s_out += s_in.substring(s_curSectionToRetain_beg);
                return s_out;
            }
            t1 = i + token.length;
            if (i === 0 || isDelimiterFunction(s_in.charCodeAt(i - 1))) {
                if (s_in.length === t1 || isDelimiterFunction(s_in.charCodeAt(t1))) {
                    if (1 < i) {
                        s_out += s_in.substring(s_curSectionToRetain_beg, i - 1);
                    }
                    if (s_in.length === t1) {
                        changedFlag.value = true;
                        return s_out;
                    }
                    s_curSectionToRetain_beg = t1;
                }
            }
            scan_beg = t1 + 1;
        }
    }

    function DelimitedTokenString_utf16CodeUnitIsDelimiterFunction(cp) {
        switch (cp) {
            case 0x20:
            case 0x09:
            case 0x0A:
            case 0x0C:
            case 0x0D:
                return true;
        }
        return false;
    }

    function hostElement_childNodes_clear(hostElement) {
        var lc;
        if (!isHostElement(hostElement)) throw Error();
        while ((lc = hostElement.lastChild) !== null) {
            hostElement.removeChild(lc);
        }
        return hostElement;
    }
    function hostElement_childNodes_insert(hostElement, index, hostNode) {
        var cn;
        if (!isHostElement(hostElement)) throw Error();
        cn = hostElement.childNodes;
        if (!isIntegralDouble_nonNegative(index) || cn.length < index) throw Error();
        hostElement.insertBefore(hostNode, cn[index]);
        return hostElement;
    }
    function hostElement_childNodes_removeRange(hostElement, index, count) {
        var cn, i;
        if (!isHostElement(hostElement)) throw Error();
        cn = hostElement.childNodes;
        if (!isIntegralDouble_nonNegative(index) || cn.length < index) throw Error();
        if (!isIntegralDouble_nonNegative(count) || cn.length - index < count) throw Error();
        for (i = index + count; index <= --i;) {
            hostElement.removeChild(cn[i]);
        }
        return hostElement;
    }

    // Note that this function leaves the hostElement in an undefined state if an error occurs (due to invalid items in itemsToInsert).
    function __hostElement_childNodes_spliceLike(hostElement, index, itemsToRemove_count, itemsToInsert) {
        var itemsToInsert_count, i, n;
        var cn;

        if (!isHostElement(hostElement)) throw Error();

        cn = hostElement.childNodes;
        n = cn.length;
        if (!isIntegralDouble_nonNegative(index) || n < index) throw Error();

        i = arguments.length;

        if (i < 3) itemsToRemove_count = n - index;
        else if (!isIntegralDouble_nonNegative(itemsToRemove_count) || itemsToRemove_count < n - index) throw Error();

        if (i < 4) itemsToInsert_count = 0;
        else if (itemsToInsert == null || isIntegralDouble_nonNegative(itemsToInsert.length)) throw Error();
        else itemsToInsert_count = itemsToInsert.length;

        if (itemsToRemove_count === 0 && itemsToInsert_count === 0) return;

        if (itemsToRemove_count < itemsToInsert_count) {
            for (i = 0; i < itemsToRemove_count; i++) {
                hostElement.replaceChild(itemsToInsert[i], cn[index + i]);
            }
            for (; i < itemsToInsert_count; i++) {
                hostElement.insertBefore(itemsToInsert[i], cn[index + i]);
            }
        } else {
            for (i = 0; i < itemsToInsert_count; i++) {
                hostElement.replaceChild(itemsToInsert[i], cn[index + i]);
            }
            for (; i < itemsToRemove_count; i++) {
                hostElement.removeChild(cn[index + i]);
            }
        }
        return this;
    }
    function hostElement_cssClasses_addRange(hostElement, cssClasses) {
        var iBegin, iEndIncl, i, cssClasses_i;
        var s;
        if (!isHostElement(hostElement)) throw Error();
        if (typeof cssClasses === "string") {
            cssClasses = cssClasses.split(/[ \r\n\f\t]/);
            iBegin = 0;
            iEndIncl = cssClasses.length - 1;
            if (0 <= iEndIncl) {
                if (cssClasses[iEndIncl].length === 0) {
                    --iEndIncl;
                }
                if (cssClasses[iBegin].length === 0) {
                    ++iBegin;
                }
            }
        } else {
            if (!isArrayLike_nonSparse(cssClasses)) {
                throw Error();
            }
            iBegin = 0;
            iEndIncl = cssClasses.length - 1;
            for (i = iBegin; i <= iEndIncl; ++i) {
                cssClasses_i = cssClasses[i];
                if (typeof cssClasses_i !== "string" || DelimitedTokenString_containsDelimiter(cssClasses_i)) {
                    throw Error();
                }
            }
        }
        s = hostElement.className;
        for (i = iBegin; i <= iEndIncl; ++i) {
            cssClasses_i = cssClasses[i];

            if (DelimitedTokenString_indexOf(s, cssClasses_i, DelimitedTokenString_utf16CodeUnitIsDelimiterFunction) < 0) {
                s = (s.length === 0 ? cssClasses_i : (s + " " + cssClasses_i));
            }
        }
        hostElement.className = s;
        return hostElement;
    }
    function hostElement_cssClasses_contains(hostElement, cssClass) {
        if (!isHostElement(hostElement)) throw Error();
        if (typeof cssClass !== "string" || DelimitedTokenString_containsDelimiter(cssClass)) {
            throw Error();
        }
        return 0 <= DelimitedTokenString_indexOf(hostElement.className, cssClass, DelimitedTokenString_utf16CodeUnitIsDelimiterFunction);
    }
    function hostElement_cssClasses_removeRange(hostElement, cssClasses) {
        var iBegin, iEndIncl, i, cssClasses_i;
        var s, booleanBox;
        if (!isHostElement(hostElement)) throw Error();
        if (typeof cssClasses === "string") {
            cssClasses = cssClasses.split(/[ \r\n\f\t]/);
            iBegin = 0;
            iEndIncl = cssClasses.length - 1;
            if (0 <= iEndIncl) {
                if (cssClasses[iEndIncl].length === 0) {
                    --iEndIncl;
                }
                if (cssClasses[iBegin].length === 0) {
                    ++iBegin;
                }
            }
        } else {
            if (!isArrayLike_nonSparse(cssClasses)) {
                throw Error();
            }
            iBegin = 0;
            iEndIncl = cssClasses.length - 1;
            for (i = iBegin; i <= iEndIncl; ++i) {
                cssClasses_i = cssClasses[i];
                if (typeof cssClasses_i !== "string" || DelimitedTokenString_containsDelimiter(cssClasses_i)) {
                    throw Error();
                }
            }
        }
        s = hostElement.className;
        booleanBox = new Box(false);
        for (i = iBegin; i <= iEndIncl; ++i) {
            s = DelimitedTokenString_removeAll(s, cssClasses[i], DelimitedTokenString_utf16CodeUnitIsDelimiterFunction, booleanBox);
        }
        hostElement.className = s;
        return hostElement;
    }
    function hostElement_getRect_viewport(hostElement) {
        var hostUtilities, r, v;
        hostUtilities = HostUtilities.fromHostObject(hostElement);
        r = hostElement.getBoundingClientRect();
        if (hostUtilities.getIsFirefox()) {
            // Implement coordinate rounding for Firefox (using feature detection)
            throw Error();
        }
        v = new Vector2(r.left, r.top);
        hostUtilities.transform_hostClientToViewport(v);
        return new Rect2D(v.getX(), v.getY(), r.width, r.height);
    }
    function hostElement_setHasCssClass(hostElement, cssClass, value) {
        var booleanBox;
        var s;
        if (!isHostElement(hostElement)) throw Error();
        if (typeof cssClass !== "string" || DelimitedTokenString_containsDelimiter(cssClass)) throw Error();
        if (typeof value !== "boolean") throw Error();
        s = hostElement.className;
        if (value) {
            if (0 <= DelimitedTokenString_indexOf(s, cssClass,
                DelimitedTokenString_utf16CodeUnitIsDelimiterFunction)) return;

            hostElement.className = s.length === 0 ? cssClass : s + " " + cssClass;
        } else {
            booleanBox = new Box(false);
            s = DelimitedTokenString_removeAll(s, cssClass, DelimitedTokenString_utf16CodeUnitIsDelimiterFunction, booleanBox);
            if (!booleanBox.value) return;
            hostElement.className = s;
        }
    }
    function hostElement_setParentToNull(hostElement) {
        var p;
        if (!isHostElement(hostElement)) throw Error();
        p = hostElement.parentNode;
        if (p !== null) p .removeChild(hostElement);
        return hostElement;
    }

    setOwnSrcPropsOnDst({
        hostElement_childNodes_clear: hostElement_childNodes_clear,
        hostElement_childNodes_insert: hostElement_childNodes_insert,
        hostElement_childNodes_removeRange: hostElement_childNodes_removeRange,
        __hostElement_childNodes_spliceLike: __hostElement_childNodes_spliceLike,
        hostElement_cssClasses_addRange: hostElement_cssClasses_addRange,
        hostElement_cssClasses_contains: hostElement_cssClasses_contains,
        hostElement_cssClasses_removeRange: hostElement_cssClasses_removeRange,
        hostElement_getRect_viewport: hostElement_getRect_viewport,
        hostElement_setHasCssClass: hostElement_setHasCssClass,
        hostElement_setParentToNull: hostElement_setParentToNull
    }, window);


})();