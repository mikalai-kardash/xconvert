# xconvert

A simple converter of XML data into JSON format. It has built-in rules, but all in all it is very simple.

It will turn the following XML:
```xml
<?xml version="1.0" ?>
<sdk:sdk-addons-list xmlns:sdk="http://schemas.android.com/sdk/android/addons-list/2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<!--Generated on 2016-07-21 16:22:25.598149 with ADRT.-->
	<sdk:addon-site>
		<sdk:name>Google Inc.</sdk:name>
		<sdk:url>addon.xml</sdk:url>
	</sdk:addon-site>
	<sdk:addon-site>
		<sdk:name>Glass Development Kit, Google Inc.</sdk:name>
		<sdk:url>glass/addon.xml</sdk:url>
	</sdk:addon-site>
	<sdk:addon-site>
		<sdk:name>Intel HAXM</sdk:name>
		<sdk:url>extras/intel/addon.xml</sdk:url>
	</sdk:addon-site>
	<sdk:sys-img-site>
		<sdk:name>Android System Images</sdk:name>
		<sdk:url>sys-img/android/sys-img.xml</sdk:url>
	</sdk:sys-img-site>
	<sdk:sys-img-site>
		<sdk:name>Android Wear System Images</sdk:name>
		<sdk:url>sys-img/android-wear/sys-img.xml</sdk:url>
	</sdk:sys-img-site>
	<sdk:sys-img-site>
		<sdk:name>Android TV System Images</sdk:name>
		<sdk:url>sys-img/android-tv/sys-img.xml</sdk:url>
	</sdk:sys-img-site>
	<sdk:sys-img-site>
		<sdk:name>Google API add-on System Images</sdk:name>
		<sdk:url>sys-img/google_apis/sys-img.xml</sdk:url>
	</sdk:sys-img-site>
</sdk:sdk-addons-list>
```
Into this JSON:
```json
{
    "@version": "1.0",
    "sdk:sdk-addons-list": {
        "@name": "sdk:sdk-addons-list",
        "xmlns:sdk": "http://schemas.android.com/sdk/android/addons-list/2",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@items": [
            {
                "@name": "sdk:addon-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Google Inc." },
                    { "@name": "sdk:url", "@text": "addon.xml" }
                ]
            },
            {
                "@name": "sdk:addon-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Glass Development Kit, Google Inc." },
                    { "@name": "sdk:url", "@text": "glass/addon.xml" }
                ]
            },
            {
                "@name": "sdk:addon-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Intel HAXM" },
                    { "@name": "sdk:url", "@text": "extras/intel/addon.xml" }
                ]
            },
            {
                "@name": "sdk:sys-img-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Android System Images" },
                    { "@name": "sdk:url", "@text": "sys-img/android/sys-img.xml" }
                ]
            },
            {
                "@name": "sdk:sys-img-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Android Wear System Images" },
                    { "@name": "sdk:url", "@text": "sys-img/android-wear/sys-img.xml" }
                ]
            },
            {
                "@name": "sdk:sys-img-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Android TV System Images" },
                    { "@name": "sdk:url", "@text": "sys-img/android-tv/sys-img.xml" }
                ]
            },
            {
                "@name": "sdk:sys-img-site",
                "@items": [
                    { "@name": "sdk:name", "@text": "Google API add-on System Images" },
                    { "@name": "sdk:url", "@text": "sys-img/google_apis/sys-img.xml" }
                ]
            }
        ]
    }
}
```


# TODO

Several things left to accomplish before it can be used.

## Publishing

0. Integrate with AppVeyor CI
1. create project description
2. configure npm scripts
3. set keywords
4. set license
5. set main

## Build Process (Gulp)

1. version bump
2. prod vs dev (yargs based?)
3. optimize build
   - parser changed > run tests for parser only
   - particular test changes > recompile it and run this test only
4. add custom logging for watching and vscode integration
5. memory file cache to speed up process of rebuilding things
6. split compilation, style check and tests into steps
   - move configs
7. implement build and gulp in ts
8. translate unit test failures back to ts files (source-map-support?)

## Implementation

1. Visitor - Rework to be same style, simplicity.
2. tsconfig.json for each part
   - build
   - tests
   - sources
3. readme
   - description
   - examples
4. choose typings vs @types
5. add streams + buffers support (accept readable stream and return readable stream)
6. use jump / stepBack manager methods to manipulate parsing logic
7. provide stats?
8. [x] Remove ambient declarations from source
9. .. references

## vscode integration

1. problem matchers
