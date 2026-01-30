<?php
namespace CustoDesk\Page\Login;

use CustoDesk\Page\Common\PageWithPostController;
use CustoDesk\RequestMetadata;

class LoginController extends PageWithPostController
{
    public string $template = "login";

    public function onGet(RequestMetadata $request): bool
    {
        return true;
    }

    public function onPost(RequestMetadata $request): bool
    {
        $this->data->error = "Not implemented";
        return true;
    }
}