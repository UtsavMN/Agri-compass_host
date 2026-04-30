@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@echo off
setlocal EnableDelayedExpansion

@REM set %HOME% to %USERPROFILE% if %HOME% is not set
if "%HOME%" == "" (set "HOME=%USERPROFILE%")

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@REM Attempt to auto-detect JRE from Red Hat extension if JAVA_HOME is not set
if not defined JAVA_HOME (
    set "REDHAT_JRE_PATH=%USERPROFILE%\.antigravity\extensions\redhat.java-1.53.0-win32-x64\jre\21.0.10-win32-x86_64"
    if exist "!REDHAT_JRE_PATH!\bin\java.exe" (
        set "JAVA_HOME=!REDHAT_JRE_PATH!"
        echo [mvnw] Using detected JRE: !JAVA_HOME!
    )
)

@REM Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%\bin\java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
goto fail

:init
@REM Find the project base dir
set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
if not "%MAVEN_PROJECTBASEDIR%"=="" goto endDetectBaseDir

set EXEC_DIR=%CD%
set WBASEDIR=%EXEC_DIR%
:findBaseDir
if exist "%WBASEDIR%\.mvn" goto foundBaseDir
set "WBASEDIR=%WBASEDIR%\.."
if "%WBASEDIR%"=="%WBASEDIR%\.." goto defaultBaseDir
goto findBaseDir

:foundBaseDir
set MAVEN_PROJECTBASEDIR=%WBASEDIR%
goto endDetectBaseDir

:defaultBaseDir
set MAVEN_PROJECTBASEDIR=%EXEC_DIR%

:endDetectBaseDir

@REM Get command-line arguments
set MAVEN_ARGS=%*

:execute
@REM Setup the command line
set CLASSPATH=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar

@REM Execute Maven Wrapper
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %MAVEN_OPTS% -classpath "%CLASSPATH%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %MAVEN_ARGS%

:end
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
exit /b 1

:mainEnd
endlocal
