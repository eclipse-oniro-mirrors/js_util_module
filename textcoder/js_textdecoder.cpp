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

#include "js_textdecoder.h"
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <codecvt>
#include <locale>
#include "utils/log.h"
#include "unicode/unistr.h"
#include "securec.h"

TextDecoder::TextDecoder(napi_env env, std::string buff, std::vector<int> optionVec)
    : env_(env), label_(0), encStr_(buff), tranTool_(nullptr, nullptr)
{
    uint32_t i32Flag = 0;
    if (optionVec.size() == 2) { // 2:Meaning of optionVec size 2
        if (optionVec[0] >= 0 && optionVec[1] >= 0) {
            i32Flag |= optionVec[0] ? FATAL_FLG : 0;
            i32Flag |= optionVec[1] ? IGNORE_BOM_FLG : 0;
        } else if (optionVec[0] >= 0 && optionVec[1] < 0) {
            i32Flag |= optionVec[0] ? FATAL_FLG : 0;
        } else if (optionVec[0] < 0 && optionVec[1] >= 0) {
            i32Flag |= optionVec[1] ? IGNORE_BOM_FLG : 0;
        }
    }
    label_ = i32Flag;
    bool fatal =
      (i32Flag & FATAL_FLG) == FATAL_FLG;
    UErrorCode codeflag = U_ZERO_ERROR;
    char* pStr = const_cast<char*>(encStr_.c_str());
    UConverter* conv = ucnv_open(pStr, &codeflag);
    if (U_FAILURE(codeflag)) {
        HILOG_ERROR("ucnv_open failed !");
        return;
    }
    if (fatal) {
        codeflag = U_ZERO_ERROR;
        ucnv_setToUCallBack(conv, UCNV_TO_U_CALLBACK_STOP, nullptr, nullptr, nullptr, &codeflag);
    }
    TransformToolPointer  tempTranTool(conv, ConverterClose);
    tranTool_ = std::move(tempTranTool);
}

napi_value TextDecoder::Decode(napi_value src, bool iflag)
{
    uint32_t flags = 0;
    flags |= iflag ? 0 : FLUSH_FLG;
    UBool flush = ((flags & FLUSH_FLG)) == FLUSH_FLG;
    napi_typedarray_type type;
    size_t length = 0;
    void* data1 = nullptr;
    napi_value arrayBuffer = nullptr;
    size_t byteOffset = 0;
    NAPI_CALL(env_, napi_get_typedarray_info(env_, src, &type, &length, &data1, &arrayBuffer, &byteOffset));
    const char* source = static_cast<char*>(data1);
    size_t sourceLength = length;
    UErrorCode codeflag = U_ZERO_ERROR;
    size_t limit = GetMinByteSize() * sourceLength;
    size_t len = limit * sizeof(UChar);
    UChar* arr = nullptr;
    if (limit > 0) {
        arr = new UChar[limit + 1];
        if (memset_s(arr, len + sizeof(UChar), 0x0, len + sizeof(UChar)) != 0) {
            HILOG_ERROR("decode arr memset_s failed");
            if (arr != nullptr) {
                delete[] arr;
                arr = nullptr;
            }
            return nullptr;
        }
    } else {
        HILOG_ERROR("limit is error");
        return nullptr;
    }
    UChar* target = arr;
    size_t tarStartPos = (intptr_t)arr;
    ucnv_toUnicode(GetConverterPtr(), &target, target + len, &source, source + sourceLength, nullptr, flush, &codeflag);
    size_t resultLength = 0;
    bool omitInitialBom = false;
    if (U_SUCCESS(codeflag)) {
        if (limit > 0) {
            resultLength = (intptr_t)target - tarStartPos;
            if (resultLength > 0 && IsUnicode() && !IsIgnoreBom() && !IsBomFlag()) {
                if (arr[0] == 0xFEFF) {
                    omitInitialBom = true;
                }
                label_ |= BOM_SEEN_FLG;
            }
        }
    }
    UChar* arrDat = arr;
    if (omitInitialBom && resultLength > 0) {
        arrDat = &arr[2]; // 2: Obtains the 2 value of the array.
    }
    std::u16string tempStr16(arrDat);
    std::string tepStr = std::wstring_convert< std::codecvt_utf8_utf16<char16_t>, char16_t > {}.to_bytes(tempStr16);
    const char* tempCh = tepStr.c_str();
    char* rstCh = const_cast<char*>(tempCh);
    napi_value resultStr = nullptr;
    NAPI_CALL(env_, napi_create_string_utf8(env_, rstCh, strlen(rstCh), &resultStr));
    if (arr != nullptr) {
        delete[] arr;
        arr = nullptr;
    }
    if (flush) {
        label_ &= BOM_SEEN_FLG;
        Reset();
    }
    return resultStr;
}

napi_value TextDecoder::GetEncoding() const
{
    size_t length = strlen(encStr_.c_str());
    napi_value result = nullptr;
    NAPI_CALL(env_, napi_create_string_utf8(env_, encStr_.c_str(), length, &result));
    return result;
}

napi_value TextDecoder::GetFatal() const
{
    uint32_t temp = label_ & FATAL_FLG;
    bool comRst = false;
    if (temp == FATAL_FLG) {
        comRst = true;
    } else {
        comRst = false;
    }
    napi_value result = nullptr;
    NAPI_CALL(env_, napi_get_boolean(env_, comRst, &result));
    return result;
}

napi_value TextDecoder::GetIgnoreBOM() const
{
    uint32_t temp = label_ & IGNORE_BOM_FLG;
    bool comRst = false;
    if (temp == IGNORE_BOM_FLG) {
        comRst = true;
    } else {
        comRst = false;
    }
    napi_value result;
    NAPI_CALL(env_, napi_get_boolean(env_, comRst, &result));
    return result;
}

size_t TextDecoder::GetMinByteSize() const
{
    if (tranTool_ == nullptr) {
        return -1;
    }
    size_t res = ucnv_getMinCharSize(tranTool_.get());
    return res;
}

void TextDecoder::Reset() const
{
    if (tranTool_ == nullptr) {
        return;
    }
    ucnv_reset(tranTool_.get());
}
