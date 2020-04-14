#include "bindings.h"
#include "string.h"
#ifdef WIN32
BOOL GetLastWriteTime(char *strDate, FILETIME ftWrite)
{
  DWORD dwRet;
  SYSTEMTIME st, stLocal;
  // Convert the last-write time to local time.
  FileTimeToSystemTime(&ftWrite, &st);
  SystemTimeToTzSpecificLocalTime(NULL, &st, &stLocal);
  snprintf(strDate, 20, "%d-%02d-%02dT%02d:%02d:%02d", stLocal.wYear, stLocal.wMonth, stLocal.wDay,
           stLocal.wHour, stLocal.wMinute, stLocal.wSecond);
  // Build a string showing the date and time.

  if (S_OK == dwRet)
    return TRUE;
  else
    return FALSE;
}
#endif
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  return Win_Explorer::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);

#ifdef WIN32
Napi::Array Win_Explorer::ListFiles(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (!info[0].IsString())
  {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
  }

  Napi::String path = info[0].As<Napi::String>();
  std::u16string str1 = path.Utf16Value();
  std::string str2 = path.ToString();

  Napi::Array objectArray = Napi::Array::New(env);
  char strDate[20];

  setlocale(LC_ALL, "C.UTF-8");
  WIN32_FIND_DATAW ffd;
  HANDLE hFind;
  
  Napi::Boolean isOne = info[1].As<Napi::Boolean>();
  bool oneFile = isOne.ToBoolean();
	if (!oneFile)
  {
    str1.push_back('\\');
    str1.push_back('*');
  }

  hFind = FindFirstFileW((wchar_t *)str1.c_str(), &ffd);
  if (hFind == INVALID_HANDLE_VALUE)
  {
    return objectArray;
  }

  int i = 0;

  do
  {
    try
    {

      if (ffd.cFileName[0] == L'.' || ffd.dwFileAttributes & FILE_ATTRIBUTE_SYSTEM)
        continue;
      Napi::Object file = Napi::Object::New(env);
      file.Set("FileName", Napi::String::New(env, (const char16_t *)ffd.cFileName));

      bool isDir = ffd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY ? true : false;
      file.Set("isDirectory", Napi::Boolean::New(env, isDir));
      file.Set("isHidden", Napi::Boolean::New(env, ffd.dwFileAttributes & 0x02 ? true : false));
      GetLastWriteTime(strDate, ffd.ftLastWriteTime);

      file.Set("LastModified", Napi::String::New(env, strDate));

      if (!isDir)
      {
        wchar_t *pstr = wcsrchr(ffd.cFileName, '.');
        int pos = (int)(pstr - ffd.cFileName + 1);
        file.Set("extension", Napi::String::New(env, (const char16_t *)ffd.cFileName + pos));
        file.Set("Size", Napi::Number::New(env, ffd.nFileSizeLow));
      }
      else
      {
        file.Set("extension", Napi::String::New(env, "none"));
      }

      objectArray[i++] = file;
    }
    catch (...)
    {
      // Napi::TypeError::New(env, "catch Error").ThrowAsJavaScriptException();
      continue;
    }
  } while (FindNextFileW(hFind, &ffd) != 0);

  FindClose(hFind);

  return objectArray;
}
#else
Napi::Array Win_Explorer::ListFiles(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (!info[0].IsString())
  {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
  }

  Napi::String path = info[0].As<Napi::String>();
  std::u16string str1 = path.Utf16Value();
  std::string str2 = path.ToString();

  Napi::Array objectArray = Napi::Array::New(env);

  setlocale(LC_ALL, "C.UTF-8");
  struct dirent *d_file;
  int i = 0;
  DIR *d_dir = opendir(str2.c_str());
  if(d_dir != NULL){

    while((d_file = readdir(d_dir))){

      if (d_file->d_name[0] == '.') continue;
      if (strcmp(d_file->d_name, "..")) continue;

      Napi::Object file = Napi::Object::New(env);
      file.Set("FileName", Napi::String::New(env, d_file->d_name));

      bool isDir = d_file->d_type == DT_DIR;
      file.Set("isDirectory", Napi::Boolean::New(env, isDir));
      file.Set("isHidden", Napi::Boolean::New(env, false));

      file.Set("LastModified", Napi::String::New(env, ""));

      if (!isDir)
      {
        std::string str = std::string(d_file->d_name);
        
        
        int pos = (int)str.find_last_of(".")+1;

        file.Set("extension", Napi::String::New(env, (const char16_t *)d_file->d_name + pos));
        std::string basePath = str2 + std::string(d_file->d_name);

        struct stat statbuf;
        stat(basePath.c_str(), &statbuf);

        file.Set("Size", Napi::Number::New(env,  (intmax_t) statbuf.st_size));
      }
      else
      {
        file.Set("extension", Napi::String::New(env, "none"));
      }

      objectArray[i++] = file;
    }
  }

  return objectArray;
}
#endif


#define MAX 256
#ifdef WIN32
Napi::Array Win_Explorer::ListDrivesInfo(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Array drivers = Napi::Array::New(env);
  int dr_type = 99;
  char dr_avail[MAX];
  char *temp = dr_avail;

  GetLogicalDriveStrings(MAX, dr_avail);
  int i = 0;
  while (*temp != NULL)
  { // Split the buffer by null
    dr_type = GetDriveType(temp);
    //printf("%s : %s\n",temp,drive[dr_type]);
    Napi::Object driver = Napi::Object::New(env);

    driver.Set("Drive", Napi::String::New(env, temp));
    driver.Set("Type", Napi::Number::New(env, dr_type));

    temp += strlen(temp) + 1; // incriment the buffer
    drivers[i++] = driver;
  }
  return drivers;
}
#else
Napi::Array Win_Explorer::ListDrivesInfo(const Napi::CallbackInfo &info)
{
   Napi::Env env = info.Env();
  Napi::Array drivers = Napi::Array::New(env);

  return drivers;
}
#endif

bool checkFilter(std::vector<std::string> list, wchar_t *ex)
{
  return false;
}

//funtion exporter
Napi::Object Win_Explorer::Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(
      "ListFiles", Napi::Function::New(env, Win_Explorer::ListFiles));
  exports.Set(
      "ListDrivesInfo", Napi::Function::New(env, Win_Explorer::ListDrivesInfo));

  return exports;
}
