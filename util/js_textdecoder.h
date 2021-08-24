/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef FOUNDATION_CCRUNTIME_TEXTCODER_JS_TEXTDECODER_H
#define FOUNDATION_CCRUNTIME_TEXTCODER_JS_TEXTDECODER_H

#include <string>
#include <vector>
#include <memory.h>
#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "unicode/ucnv.h"

using TransformToolPointer = std::unique_ptr<UConverter, void(*)(UConverter*)>;

class TextDecoder {
public:
    enum ConverterFlags {
        FLUSH_FLG = 0x1,
        FATAL_FLG = 0x2,
        IGNORE_BOM_FLG = 0x4,
        UNICODE_FLG = 0x8,
        BOM_SEEN_FLG = 0x10,
    };
public:
    TextDecoder(napi_env env, std::string buff, std::vector<int> optionVec);
    virtual ~TextDecoder() {}
    napi_value Decode(napi_value src, bool iflag);
    napi_value GetEncoding() const;
    napi_value GetFatal() const;
    napi_value GetIgnoreBOM() const;
    size_t GetMinByteSize() const;
    void Reset() const;
    UConverter *GetConverterPtr() const
    {
        return tranTool_.get();
    }
    bool IsBomFlag() const
    {
        uint32_t temp = label_ & BOM_SEEN_FLG;
        if (temp == BOM_SEEN_FLG) {
            return true;
        } else {
            return false;
        }
    }
    bool IsUnicode() const
    {
        uint32_t temp = label_ & UNICODE_FLG;
        if (temp == UNICODE_FLG) {
            return true;
        } else {
            return false;
        }
    }
    bool IsIgnoreBom() const
    {
        uint32_t temp = label_ & IGNORE_BOM_FLG;
        if (temp == IGNORE_BOM_FLG) {
            return true;
        } else {
            return false;
        }
    }
    static void ConverterClose(UConverter* pointer)
    {
        ucnv_close(pointer);
    }
private:
    void FreedMemory(UChar *pData);
    napi_env env_;
    uint32_t label_;
    std::string encStr_;
    TransformToolPointer tranTool_;
};
#endif /* FOUNDATION_CCRUNTIME_TEXTCODER_JS_TEXTDECODER_H */
