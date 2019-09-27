<?php

namespace Stipic\EasyMenuBundle\Controller;

use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;

class MenuBuilderController extends BaseAdminController
{
    public function menuBuilderPage()
    {
        return $this->render(
            '@StipicEasyMenu/Menu/menu-build-page.html.twig',
            [
                
            ]
        );
    }
}