package com.detector.eye.teach.teacheyedetector;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by yuval.saraf on 3/1/2016.
 */
public class ReactNativePackage extends ReactContextBaseJavaModule {
  private Context _context;
  public ReactNativePackage(Context c,ReactApplicationContext reactContext) {
        super(reactContext);
        _context=c;
    }

    @Override
    public String getName() {
        return "ReactNativePackage";
    }
    @ReactMethod
    public void start(String name) {
      SharedPreferences sp= PreferenceManager.getDefaultSharedPreferences(this._context);
      SharedPreferences.Editor edit=sp.edit();
      edit.putString(ConfigAppData.USER_NAME, name);
      edit.putLong(ConfigAppData.SESSION_ID, System.currentTimeMillis());
      edit.putBoolean(ConfigAppData.CAMERA_TRACK, true);
      edit.commit();
      String userName=sp.getString(ConfigAppData.USER_NAME,null);
      Log.d("UserName", "user");

    }
    @ReactMethod
    public void done() {
      SharedPreferences sp= PreferenceManager.getDefaultSharedPreferences(this._context);
      SharedPreferences.Editor edit=sp.edit();
      edit.putBoolean(ConfigAppData.CAMERA_TRACK,false);
      edit.putLong(ConfigAppData.SESSION_ID, -1);
      edit.commit();
      System.out.println("DONE");
    }
}
