package com.detector.eye.teach.teacheyedetector;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by yuval.saraf on 3/1/2016.
 */
public class ReactNativePackage extends ReactContextBaseJavaModule {
    public ReactNativePackage(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ReactNativePackage";
    }
    @ReactMethod
    public void start(String name) {
        System.out.println(name);
    }
    @ReactMethod
    public void done() {
        System.out.println("DONE");
    }
}
