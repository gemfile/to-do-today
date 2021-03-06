package com.todo_today;

import android.app.Application;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.todo_today.canvasview.CanvasViewPackage;
import com.todo_today.taskticking.TaskTickingPackage;
import com.zmxv.RNSound.RNSoundPackage;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.activityandroid.ActivityAndroidPackage;
import io.fullstack.firestack.FirestackPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new ActivityAndroidPackage(),
              new RNSoundPackage(),
              new ReactNativePushNotificationPackage(),
              new ReactMaterialKitPackage(),
              new FirestackPackage(),
              new RNDeviceInfo(),
              new CanvasViewPackage(),
              new TaskTickingPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
