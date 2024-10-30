import CommonForm from "@/components/common-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin');

  function handleTabChange(value) {
    setActiveTab(value);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={'/'} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">ONLINE LEARN</span>
        </Link>
      </header>
      
      {/* Center the Tabs in the page */}
      <div className="flex flex-1 items-center justify-center bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="flex w-full justify-center gap-4 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
          <CommonForm 
              formControls={signInFormControls}
            />
            </TabsContent>
          <TabsContent value="signup">
            <CommonForm 
              formControls={signUpFormControls}
            />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
