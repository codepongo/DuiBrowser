/*
    This file is part of the WebKit open source project.
    This file has been generated by generate-bindings.pl. DO NOT MODIFY!

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Library General Public
    License as published by the Free Software Foundation; either
    version 2 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Library General Public License for more details.

    You should have received a copy of the GNU Library General Public License
    along with this library; see the file COPYING.LIB.  If not, write to
    the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
    Boston, MA 02110-1301, USA.
*/

#include "config.h"

#include "JSMessageEvent.h"

#include <wtf/GetPtr.h>

#include "DOMWindow.h"
#include "JSDOMWindow.h"
#include "KURL.h"
#include "MessageEvent.h"

#include <kjs/Error.h>
#include <kjs/JSNumberCell.h>
#include <kjs/JSString.h>

using namespace JSC;

namespace WebCore {

ASSERT_CLASS_FITS_IN_CELL(JSMessageEvent)

/* Hash table */

static const HashTableValue JSMessageEventTableValues[6] =
{
    { "data", (intptr_t)JSMessageEvent::DataAttrNum, DontDelete|ReadOnly, 0 },
    { "origin", (intptr_t)JSMessageEvent::OriginAttrNum, DontDelete|ReadOnly, 0 },
    { "lastEventId", (intptr_t)JSMessageEvent::LastEventIdAttrNum, DontDelete|ReadOnly, 0 },
    { "source", (intptr_t)JSMessageEvent::SourceAttrNum, DontDelete|ReadOnly, 0 },
    { "constructor", (intptr_t)JSMessageEvent::ConstructorAttrNum, DontEnum, 0 },
    { 0, 0, 0, 0 }
};

static const HashTable JSMessageEventTable = { 15, JSMessageEventTableValues, 0 };

/* Hash table for constructor */

static const HashTableValue JSMessageEventConstructorTableValues[1] =
{
    { 0, 0, 0, 0 }
};

static const HashTable JSMessageEventConstructorTable = { 0, JSMessageEventConstructorTableValues, 0 };

class JSMessageEventConstructor : public DOMObject {
public:
    JSMessageEventConstructor(ExecState* exec)
        : DOMObject(exec->lexicalGlobalObject()->objectPrototype())
    {
        putDirect(exec->propertyNames().prototype, JSMessageEventPrototype::self(exec), None);
    }
    virtual bool getOwnPropertySlot(ExecState*, const Identifier&, PropertySlot&);
    JSValue* getValueProperty(ExecState*, int token) const;
    virtual const ClassInfo* classInfo() const { return &s_info; }
    static const ClassInfo s_info;

    virtual bool implementsHasInstance() const { return true; }
};

const ClassInfo JSMessageEventConstructor::s_info = { "MessageEventConstructor", 0, &JSMessageEventConstructorTable, 0 };

bool JSMessageEventConstructor::getOwnPropertySlot(ExecState* exec, const Identifier& propertyName, PropertySlot& slot)
{
    return getStaticValueSlot<JSMessageEventConstructor, DOMObject>(exec, &JSMessageEventConstructorTable, this, propertyName, slot);
}

JSValue* JSMessageEventConstructor::getValueProperty(ExecState* exec, int token) const
{
    // The token is the numeric value of its associated constant
    return jsNumber(exec, token);
}

/* Hash table for prototype */

static const HashTableValue JSMessageEventPrototypeTableValues[2] =
{
    { "initMessageEvent", (intptr_t)jsMessageEventPrototypeFunctionInitMessageEvent, DontDelete|Function, 7 },
    { 0, 0, 0, 0 }
};

static const HashTable JSMessageEventPrototypeTable = { 0, JSMessageEventPrototypeTableValues, 0 };

const ClassInfo JSMessageEventPrototype::s_info = { "MessageEventPrototype", 0, &JSMessageEventPrototypeTable, 0 };

JSObject* JSMessageEventPrototype::self(ExecState* exec)
{
    static const Identifier* prototypeIdentifier = new Identifier(exec, "[[JSMessageEvent.prototype]]");
    return JSC::cacheGlobalObject<JSMessageEventPrototype>(exec, *prototypeIdentifier);
}

bool JSMessageEventPrototype::getOwnPropertySlot(ExecState* exec, const Identifier& propertyName, PropertySlot& slot)
{
    return getStaticFunctionSlot<JSObject>(exec, &JSMessageEventPrototypeTable, this, propertyName, slot);
}

const ClassInfo JSMessageEvent::s_info = { "MessageEvent", &JSEvent::s_info, &JSMessageEventTable , 0 };

JSMessageEvent::JSMessageEvent(JSObject* prototype, MessageEvent* impl)
    : JSEvent(prototype, impl)
{
}

bool JSMessageEvent::getOwnPropertySlot(ExecState* exec, const Identifier& propertyName, PropertySlot& slot)
{
    return getStaticValueSlot<JSMessageEvent, Base>(exec, &JSMessageEventTable, this, propertyName, slot);
}

JSValue* JSMessageEvent::getValueProperty(ExecState* exec, int token) const
{
    switch (token) {
    case DataAttrNum: {
        MessageEvent* imp = static_cast<MessageEvent*>(impl());
        return jsString(exec, imp->data());
    }
    case OriginAttrNum: {
        MessageEvent* imp = static_cast<MessageEvent*>(impl());
        return jsString(exec, imp->origin());
    }
    case LastEventIdAttrNum: {
        MessageEvent* imp = static_cast<MessageEvent*>(impl());
        return jsString(exec, imp->lastEventId());
    }
    case SourceAttrNum: {
        MessageEvent* imp = static_cast<MessageEvent*>(impl());
        return toJS(exec, WTF::getPtr(imp->source()));
    }
    case ConstructorAttrNum:
        return getConstructor(exec);
    }
    return 0;
}

JSValue* JSMessageEvent::getConstructor(ExecState* exec)
{
    static const Identifier* constructorIdentifier = new Identifier(exec, "[[MessageEvent.constructor]]");
    return JSC::cacheGlobalObject<JSMessageEventConstructor>(exec, *constructorIdentifier);
}

JSValue* jsMessageEventPrototypeFunctionInitMessageEvent(ExecState* exec, JSObject*, JSValue* thisValue, const ArgList& args)
{
    if (!thisValue->isObject(&JSMessageEvent::s_info))
        return throwError(exec, TypeError);
    JSMessageEvent* castedThisObj = static_cast<JSMessageEvent*>(thisValue);
    MessageEvent* imp = static_cast<MessageEvent*>(castedThisObj->impl());
    const UString& typeArg = args.at(exec, 0)->toString(exec);
    bool canBubbleArg = args.at(exec, 1)->toBoolean(exec);
    bool cancelableArg = args.at(exec, 2)->toBoolean(exec);
    const UString& dataArg = args.at(exec, 3)->toString(exec);
    const UString& originArg = args.at(exec, 4)->toString(exec);
    const UString& lastEventIdArg = args.at(exec, 5)->toString(exec);
    DOMWindow* sourceArg = toDOMWindow(args.at(exec, 6));

    imp->initMessageEvent(typeArg, canBubbleArg, cancelableArg, dataArg, originArg, lastEventIdArg, sourceArg);
    return jsUndefined();
}


}