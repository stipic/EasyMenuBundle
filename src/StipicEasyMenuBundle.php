<?php

namespace Stipic\EasyMenuBundle;

use Wandi\EasyAdminPlusBundle\Acl\Compiler\TwigPathPass;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class StipicEasyMenuBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        // $container->addCompilerPass(new TwigPathPass(), PassConfig::TYPE_BEFORE_OPTIMIZATION);
    }
}
